#!/usr/bin/env python3
"""
Gyatah — Urban Anomaly Engine (menu-driven) + Visualization & Report

Run:
    python gyatah_uae_with_report.py

Features:
- Interactive menu: provide Pune Smart City CSV and AQI CSV (or press Enter to use demo data)
- Basic parameter inputs (z-score threshold, relative jump threshold)
- Hourly alignment, smoothing, simple anomaly detection on pollution & traffic signals
- Outputs anomalies.csv (user path) AND generates:
    - pm25_timeseries.png
    - anomaly_counts.png
    - anomaly_timeline.png
    - gyatah_anomaly_report.pdf
    - anomalies.csv (saved earlier)
- New: lightweight upcoming-anomaly predictor + alert notification for a user-specified horizon window
- Dependencies: pandas, numpy, matplotlib
Install:
    pip install pandas numpy matplotlib
"""

from datetime import datetime
import os
import sys
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from matplotlib.backends.backend_pdf import PdfPages

# -------------------------
# Demo data generator
# -------------------------
def generate_demo_data(start='2024-11-01', hours=24*7, seed=0):
    rng = pd.date_range(start=start, periods=hours, freq='h')
    np.random.seed(seed)
    hour = rng.hour
    pm25 = 40 + 20 * ((hour >= 7) & (hour <= 10)) + 25 * ((hour >= 18) & (hour <= 21))
    pm25 = pm25 + np.random.normal(0, 5, size=len(rng))
    traffic = 200 + 400 * ((hour >= 8) & (hour <= 9)) + 450 * ((hour >= 18) & (hour <= 19))
    traffic = traffic + np.random.normal(0, 50, size=len(rng))
    pm10 = pm25 * 1.8 + np.random.normal(0, 5, len(rng))
    no2 = pm25 * 0.15 + np.random.normal(0, 2, len(rng))
    pune = pd.DataFrame({
        'timestamp': rng,
        'traffic_count': traffic,
        'SOUND': 50 + np.random.normal(0, 3, len(rng)),
        'PM10_MAX': pm10 + 5,
        'PM10_MIN': pm10 - 5,
        'PM2_MAX': pm25 + 4,
        'PM2_MIN': pm25 - 4,
        'NO_MAX': no2 + 3,
        'NO_MIN': no2 - 3,
        'NO2_MAX': no2 + 2,
        'NO2_MIN': no2 - 2,
        'OZONE_MAX': 10 + np.random.normal(0,1,len(rng)),
        'OZONE_MIN': 5 + np.random.normal(0,1,len(rng)),
        'SO2_MAX': 8 + np.random.normal(0,1,len(rng)),
        'SO2_MIN': 3 + np.random.normal(0,1,len(rng)),
        'CO_MAX': 1 + np.random.normal(0,0.1,len(rng)),
        'CO_MIN': 0.4 + np.random.normal(0,0.05,len(rng)),
        'TEMPRATURE_MAX': 30 + 5*np.sin(hour/24*2*np.pi) + np.random.normal(0,0.5,len(rng)),
        'TEMPRATURE_MIN': 20 + 4*np.sin(hour/24*2*np.pi) + np.random.normal(0,0.5,len(rng)),
        'Lattitude': 18.5 + np.random.normal(0, 0.001, len(rng)),
        'Longitude': 73.8 + np.random.normal(0, 0.001, len(rng)),
        'LASTUPDATEDATETIME': rng
    })
    aqi = pd.DataFrame({
        'timestamp': rng,
        'City': 'Pune',
        'AQI': (pm25/2) + np.random.normal(0,3,len(rng)),
        'PM2.5': pm25,
        'PM10': pm10,
        'NO2': no2,
        'CO': 0.8 + np.random.normal(0,0.1,len(rng)),
        'SO2': 4 + np.random.normal(0,0.5,len(rng)),
        'O3': 6 + np.random.normal(0,0.5,len(rng)),
        'Temperature (°C)': 25 + np.random.normal(0,1,len(rng)),
        'Humidity (%)': 60 + np.random.normal(0,5,len(rng)),
        'Wind Speed (km/h)': 5 + np.random.normal(0,1,len(rng)),
        'Rainfall (mm)': np.zeros(len(rng)),
        'Pressure (hPa)': 1010 + np.random.normal(0,3,len(rng)),
        'Vehicle Count': traffic * 0.9,
        'Industrial Activity Index': np.random.uniform(0,1,len(rng)),
        'Health Impact Score': np.clip(pm25/100, 0, 1)
    })
    # inject anomalies
    if len(rng) > 150:
        aqi.loc[rng[100], 'PM2.5'] += 120
        pune.loc[rng[150], 'traffic_count'] += 800
    return pune, aqi

# -------------------------
# Helpers
# -------------------------
def rolling_zscore(series, window=24):
    mu = series.rolling(window=window, min_periods=max(3, window//4)).mean()
    sd = series.rolling(window=window, min_periods=max(3, window//4)).std().replace(0, np.nan)
    z = (series - mu) / sd
    return z.fillna(0)

def detect_anomaly(df, column, z_threshold=3.0, jump_threshold=0.6, smooth_window=3):
    """Detect spike anomalies for a single column and return DataFrame of events."""
    if column not in df.columns:
        return pd.DataFrame(columns=['timestamp','signal','value','z_score','jump'])
    s = df[column].astype(float).rolling(smooth_window, min_periods=1).mean()
    z = rolling_zscore(s, window=24)
    prev = s.shift(1)
    jump = ((s - prev).abs() / prev.replace(0, np.nan)).fillna(0)
    mask = (z.abs() >= z_threshold) & (jump >= jump_threshold)
    out = df.loc[mask, ['timestamp']].copy()
    out['signal'] = column
    out['value'] = s[mask]
    out['z_score'] = z[mask]
    out['jump'] = jump[mask]
    return out.reset_index(drop=True)

def hourly_align_merge_safe(pune_df, aqi_df):
    """Safely parse timestamps, coerce numeric columns, resample hourly, and merge numeric-only."""
    # Ensure timestamp columns exist and parse safely
    if 'timestamp' not in pune_df.columns and 'LASTUPDATEDATETIME' in pune_df.columns:
        pune_df = pune_df.rename(columns={'LASTUPDATEDATETIME': 'timestamp'})

    pune_df['timestamp'] = pd.to_datetime(pune_df.get('timestamp'), errors='coerce')
    aqi_df['timestamp'] = pd.to_datetime(aqi_df.get('timestamp'), errors='coerce')

    # Drop rows without valid timestamp
    pune_df = pune_df.dropna(subset=['timestamp']).copy()
    aqi_df = aqi_df.dropna(subset=['timestamp']).copy()

    # Coerce numeric-looking columns to numeric, keep non-numeric as NaN
    def coerce_numeric(df):
        df = df.copy()
        for c in df.columns:
            if c == 'timestamp':
                continue
            df[c] = pd.to_numeric(df[c], errors='coerce')
        return df

    pune_num = coerce_numeric(pune_df)
    aqi_num = coerce_numeric(aqi_df)

    pune_num = pune_num.set_index('timestamp').sort_index()
    aqi_num = aqi_num.set_index('timestamp').sort_index()

    # Resample to hourly using only numeric columns
    pune_hourly = pune_num.resample('h').mean().interpolate(limit=3).ffill().bfill()
    aqi_hourly = aqi_num.resample('h').mean().interpolate(limit=3).ffill().bfill()

    merged = pd.concat([pune_hourly, aqi_hourly], axis=1)
    merged = merged.reset_index().rename(columns={'index':'timestamp'})

    return merged

# -------------------------
# NEW: Lightweight upcoming-anomaly predictor (EWMA-based)
# -------------------------
def predict_upcoming_anomalies(merged, signals=None, horizon=6, recent_window=24,
                               ewma_alpha=0.3, z_warn=3.0, rel_warn=0.5, out_csv='predicted_upcoming_anoms.csv'):
    """
    Lightweight EWMA-based short-term predictor for upcoming anomalies.

    Args:
      merged: hourly DataFrame with 'timestamp' and numeric signal columns (e.g. 'PM2.5', 'traffic_count').
      signals: list of signals to forecast (defaults to PM2.5 and traffic_count if present).
      horizon: hours ahead to forecast (int).
      recent_window: lookback window in hours to compute mean/std for z-scores.
      ewma_alpha: smoothing factor for EWMA forecasting (0-1). Higher -> reacts faster.
      z_warn: z-score threshold used to mark a forecast as likely anomaly.
      rel_warn: relative jump threshold (fraction) used to flag likely anomaly.
      out_csv: path to save predictions.

    Returns:
      DataFrame of forecasts and flags, saved to out_csv.
    """
    if signals is None:
        signals = []
        if 'PM2.5' in merged.columns:
            signals.append('PM2.5')
        if 'traffic_count' in merged.columns:
            signals.append('traffic_count')
        # fallback to other common names
        for alt in ['PM2_MAX','PM2_MIN','PM10_MAX','Vehicle Count','SOUND']:
            if alt in merged.columns and alt not in signals:
                signals.append(alt)
    signals = [s for s in signals if s in merged.columns]
    if not signals:
        print("No suitable signals found for prediction.")
        return pd.DataFrame()

    df = merged.sort_values('timestamp').reset_index(drop=True).copy()
    results = []

    for sig in signals:
        series = df[sig].astype(float).dropna()
        if series.empty:
            continue
        # Use last available value as starting point; compute EWMA forecast iteratively
        last_ts = df['timestamp'].iloc[-1]
        # recent stats for z calculation
        recent = series.iloc[-recent_window:] if len(series) >= recent_window else series
        mu = recent.mean()
        sigma = recent.std(ddof=0) if recent.std(ddof=0) > 0 else 1e-6

        # initial EWMA state = last observed value
        s_ewma = series.iloc[-1]
        # Also compute simple linear trend (slope over recent_window) to improve forecast
        if len(recent) >= 3:
            x = np.arange(len(recent))
            # slope via polyfit on recent
            slope = np.polyfit(x, recent.values, 1)[0]
        else:
            slope = 0.0

        for h in range(1, horizon+1):
            # baseline EWMA forecast: s_t+1 = alpha * last + (1-alpha) * prev_ewma
            # we simulate iteratively and add linear trend * h to allow gradual drift
            s_ewma = ewma_alpha * series.iloc[-1] + (1 - ewma_alpha) * s_ewma
            # add simple trend
            forecast = s_ewma + slope * h
            # compute z and relative jump against recent mean / last value
            z = (forecast - mu) / sigma
            prev = series.iloc[-1]
            rel_jump = abs(forecast - prev) / (abs(prev) if abs(prev) > 1e-6 else 1e-6)

            flag = (abs(z) >= z_warn) or (rel_jump >= rel_warn)
            results.append({
                'signal': sig,
                'horizon_hours': h,
                'forecast_time': (last_ts + pd.Timedelta(hours=h)).strftime('%Y-%m-%d %H:%M:%S'),
                'forecast_value': float(forecast),
                'recent_mean': float(mu),
                'recent_std': float(sigma),
                'z_score': float(z),
                'rel_jump': float(rel_jump),
                'flag_upcoming_anomaly': bool(flag)
            })

    preds = pd.DataFrame(results)
    if not preds.empty:
        preds.to_csv(out_csv, index=False)
        print(f"Saved upcoming forecasts -> {out_csv}")
    else:
        print("No forecasts produced.")
    return preds

# -------------------------
# Reporting & visualization
# -------------------------
def build_and_save_report(merged, events_df, out_folder):
    """
    Create PNGs and a PDF report. events_df is expected to have:
      event_time | signals | max_value | max_z | max_rel_change
    If events_df is empty, the report will note that no anomalies were detected.
    """
    os.makedirs(out_folder, exist_ok=True)

    # Normalize events_df
    if events_df is None or events_df.empty:
        events = pd.DataFrame(columns=['event_time','signals','max_value','max_z','max_rel_change'])
    else:
        events = events_df.copy()
        # make sure event_time is datetime
        for c in ['event_time','timestamp','time']:
            if c in events.columns:
                events['event_time'] = pd.to_datetime(events[c], errors='coerce')
                break
        if 'signals' not in events.columns and 'signal' in events.columns:
            events['signals'] = events['signal']
        if 'signals' not in events.columns:
            events['signals'] = 'unknown'

    # Save anomalies CSV as part of report folder (also returned earlier)
    anomalies_csv = os.path.join(out_folder, 'anomalies_summary.csv')
    events.to_csv(anomalies_csv, index=False)

    # --- Plot 1: PM2.5 time series with anomaly markers ---
    p1 = os.path.join(out_folder, 'pm25_timeseries.png')
    fig1, ax1 = plt.subplots(figsize=(12,4))
    if 'PM2.5' in merged.columns:
        ax1.plot(merged['timestamp'], merged['PM2.5'], linewidth=0.8, label='PM2.5')
        pm_events = events[events['signals'].str.contains('PM2.5', na=False)]
        if not pm_events.empty:
            ax1.scatter(pm_events['event_time'], pm_events['max_value'], color='red', marker='x', label='Anomaly')
        ax1.set_title('PM2.5 time series (hourly)')
        ax1.set_xlabel('Time')
        ax1.set_ylabel('PM2.5')
        ax1.legend()
    else:
        ax1.text(0.5, 0.5, 'PM2.5 not available in merged data', ha='center')
    fig1.tight_layout()
    fig1.savefig(p1, dpi=150)
    plt.close(fig1)

    # --- Plot 2: Anomaly counts by signal ---
    p2 = os.path.join(out_folder, 'anomaly_counts.png')
    fig2, ax2 = plt.subplots(figsize=(8,3))
    if not events.empty:
        counts = events['signals'].value_counts().sort_values(ascending=False)
        counts.plot(kind='bar', ax=ax2)
        ax2.set_title('Anomaly counts by signal')
        ax2.set_ylabel('Count')
        ax2.set_xlabel('Signal')
        plt.xticks(rotation=45, ha='right')
    else:
        ax2.text(0.5, 0.5, 'No anomalies detected', ha='center')
    fig2.tight_layout()
    fig2.savefig(p2, dpi=150)
    plt.close(fig2)

    # --- Plot 3: Timeline scatter of events ---
    p3 = os.path.join(out_folder, 'anomaly_timeline.png')
    fig3, ax3 = plt.subplots(figsize=(12,3))
    if not events.empty:
        sigs = sorted(events['signals'].unique())
        sig_map = {s:i for i,s in enumerate(sigs)}
        y = events['signals'].map(sig_map)
        ax3.scatter(events['event_time'], y)
        ax3.set_yticks(list(sig_map.values()))
        ax3.set_yticklabels(list(sig_map.keys()))
        ax3.set_title('Anomaly events timeline')
        ax3.set_xlabel('Time')
    else:
        ax3.text(0.5,0.5,'No anomalies detected', ha='center')
    fig3.tight_layout()
    fig3.savefig(p3, dpi=150)
    plt.close(fig3)

    # --- Build PDF ---
    pdf_path = os.path.join(out_folder, 'gyatah_anomaly_report.pdf')
    with PdfPages(pdf_path) as pdf:
        # cover
        figc = plt.figure(figsize=(11,8.5))
        figc.text(0.5, 0.6, "Gyatah — Urban Anomaly Report", fontsize=24, ha='center')
        figc.text(0.5, 0.5, f"Generated: {datetime.now().isoformat(sep=' ', timespec='seconds')}", fontsize=10, ha='center')
        pdf.savefig(figc)
        plt.close(figc)

        # add images
        for image_path in (p1, p2, p3):
            img = plt.imread(image_path)
            figimg = plt.figure(figsize=(11,8.5))
            plt.imshow(img)
            plt.axis('off')
            pdf.savefig(figimg)
            plt.close(figimg)

        # add anomaly table (first 100 rows)
        fig_table = plt.figure(figsize=(11,8.5))
        fig_table.text(0.01, 0.95, "Top Anomaly Events (first 100 rows):", fontsize=12)
        txt = events.head(100).to_string(index=False) if not events.empty else "No anomalies detected."
        fig_table.text(0.01, 0.02, txt, fontsize=8, family='monospace')
        pdf.savefig(fig_table)
        plt.close(fig_table)

    # Return paths for user
    return {
        'pdf': pdf_path,
        'pngs': [p1, p2, p3],
        'csv': anomalies_csv
    }

# -------------------------
# Menu & Main Flow
# -------------------------
def prompt_path(label):
    p = input(f"Enter path to {label} CSV (or press Enter to use demo data): ").strip()
    return p if p else None

def load_csv_safe(path, hint=''):
    if path is None:
        return None
    if not os.path.exists(path):
        print(f"File not found: {path}")
        return None
    try:
        df = pd.read_csv(path)
        print(f"Loaded {path} → {len(df)} rows, columns: {list(df.columns)[:8]}...")
        # unify timestamp column names if present
        for cand in ['LASTUPDATEDATETIME','lastupdatedat​​etime','timestamp','time','date','Date','TIME']:
            if cand in df.columns:
                df = df.rename(columns={cand:'timestamp'})
                break
        return df
    except Exception as e:
        print("Failed to load CSV:", e)
        return None

def interactive():
    print("=== Gyatah — Urban Anomaly Engine (menu) ===")
    pune_path = prompt_path("Pune Smart City dataset (columns: LASTUPDATEDATETIME, PM2_MAX, PM10_MAX, traffic_count, etc.)")
    aqi_path = prompt_path("Indian AQI Trends dataset (columns: AQI, PM2.5, PM10, Vehicle Count, etc.)")

    pune_df = load_csv_safe(pune_path, "Pune")
    aqi_df = load_csv_safe(aqi_path, "AQI")

    if pune_df is None or aqi_df is None:
        print("One or both datasets not provided or failed to load. Using synthetic demo data.")
        pune_df, aqi_df = generate_demo_data()

    # ensure timestamps exist
    if 'timestamp' not in pune_df.columns:
        if 'LASTUPDATEDATETIME' in pune_df.columns:
            pune_df = pune_df.rename(columns={'LASTUPDATEDATETIME':'timestamp'})
        else:
            print("Pune dataset lacks timestamp column — generating hourly index.")
            pune_df['timestamp'] = pd.date_range(start=datetime.now(), periods=len(pune_df), freq='h')

    if 'timestamp' not in aqi_df.columns:
        print("AQI dataset lacks timestamp column — generating hourly index.")
        aqi_df['timestamp'] = pd.date_range(start=datetime.now(), periods=len(aqi_df), freq='h')

    # Merge numeric hourly
    merged = hourly_align_merge_safe(pune_df, aqi_df)

    print(f"Merged timeseries rows: {len(merged)}. Time range: {merged['timestamp'].min()} to {merged['timestamp'].max()}")

    # Ask for thresholds (with defaults)
    try:
        z_thresh = float(input("Enter z-score threshold (default 3.0): ") or 3.0)
    except:
        z_thresh = 3.0
    try:
        rel_thresh = float(input("Enter relative jump threshold (0-1, default 0.6): ") or 0.6)
    except:
        rel_thresh = 0.6

    # Candidate signals (use only those present)
    candidate_signals = [
        "PM2_MAX","PM2_MIN","PM10_MAX","PM10_MIN",
        "NO_MAX","NO_MIN","NO2_MAX","NO2_MIN",
        "OZONE_MAX","OZONE_MIN","SO2_MAX","SO2_MIN",
        "CO_MAX","CO_MIN","AQI","PM2.5","PM10","NO2","CO","SO2","O3",
        "traffic_count","Vehicle Count","Industrial Activity Index","SOUND"
    ]
    signals = [s for s in candidate_signals if s in merged.columns]
    print("Monitoring signals:", signals)

    # Detect per-signal anomalies
    anomaly_frames = []
    for sig in signals:
        try:
            # pass only timestamp + that column to detector to avoid accidental non-numeric columns
            df_slice = merged[['timestamp'] + [c for c in merged.columns if c == sig]]
            df_anom = detect_anomaly(df_slice, sig, z_threshold=z_thresh, jump_threshold=rel_thresh)
            if not df_anom.empty:
                print(f" → {len(df_anom)} anomalies detected in {sig}")
                anomaly_frames.append(df_anom)
        except Exception as e:
            print(f"Error detecting {sig}: {e}")

    # Fuse events occurring near same time (within 60 minutes)
    if anomaly_frames:
        all_anoms = pd.concat(anomaly_frames).sort_values('timestamp').reset_index(drop=True)
        all_anoms['rounded'] = all_anoms['timestamp'].dt.round('60min')
        grouped = all_anoms.groupby('rounded').agg({
            'timestamp': ['min'],
            'signal': lambda s: ','.join(sorted(s.unique())),
            'value': 'max',
            'z_score': 'max',
            'jump': 'max'
        })
        # flatten columns
        grouped.columns = ['timestamp_min', 'signals', 'max_value', 'max_z', 'max_rel_change']
        grouped = grouped.reset_index(drop=True)
        events = pd.DataFrame({
            'event_time': grouped['timestamp_min'],
            'signals': grouped['signals'],
            'max_value': grouped['max_value'],
            'max_z': grouped['max_z'],
            'max_rel_change': grouped['max_rel_change']
        })
    else:
        events = pd.DataFrame(columns=['event_time','signals','max_value','max_z','max_rel_change'])

    print("\n=== Anomaly Summary ===")
    if events.empty:
        print("No fused anomaly events detected.")
    else:
        print(events.head(10).to_string(index=False))

    save_path = input("\nEnter output path to save anomalies CSV (default: anomalies.csv): ").strip() or "anomalies.csv"
    events.to_csv(save_path, index=False)
    print(f"Saved {len(events)} events to {save_path}")

    # Ask whether to generate report/visuals
    gen = input("\nGenerate visual report (PNG + PDF) now? (Y/n): ").strip().lower() or 'y'
    if gen != 'n':
        out_folder = input("Output folder for report (default 'gyatah_report'): ").strip() or "gyatah_report"
        report_paths = build_and_save_report(merged, events, out_folder)
        print("\nReport generated:")
        print(" PDF:", report_paths['pdf'])
        print(" PNGs:", "\n  " + "\n  ".join(report_paths['pngs']))
        print(" Anomalies CSV (report copy):", report_paths['csv'])
    else:
        print("Skipped report generation.")

    # ---------- NEW: single menu option to run upcoming-anomaly predictor ----------
    run_pred = input("\nRun upcoming-anomaly prediction now? (Y/n): ").strip().lower() or 'y'
    if run_pred != 'n':
        try:
            horizon_input = input("Forecast horizon in hours (default 6): ").strip()
            horizon = int(horizon_input) if horizon_input else 6
        except:
            horizon = 6

        # Ask user the target prediction window to watch for alerts (default 7-12)
        try:
            window_start_input = input("Enter ALERT window START hour ahead (default 7): ").strip()
            window_start = int(window_start_input) if window_start_input else 7
        except:
            window_start = 7
        try:
            window_end_input = input("Enter ALERT window END hour ahead (default 12): ").strip()
            window_end = int(window_end_input) if window_end_input else 12
        except:
            window_end = 12
        if window_end < window_start:
            window_end = window_start

        preds = predict_upcoming_anomalies(
            merged,
            horizon=horizon,
            recent_window=24,
            ewma_alpha=0.3,
            z_warn=z_thresh,
            rel_warn=rel_thresh,
            out_csv='predicted_upcoming_anoms.csv'
        )
        if preds.empty:
            print("No upcoming anomalies predicted.")
        else:
            # Print only flagged predictions (higher signal-to-noise)
            flagged = preds[preds['flag_upcoming_anomaly'] == True]
            if flagged.empty:
                print("\nNo flagged upcoming anomalies (within forecast horizon). Full predictions saved to 'predicted_upcoming_anoms.csv'.")
                print(preds.head(20).to_string(index=False))
            else:
                print("\nFlagged upcoming anomalies (saved to 'predicted_upcoming_anoms.csv'):")
                print(flagged.to_string(index=False))

                # Now check for flags that fall in user-specified window (e.g., 7-12 hours)
                in_window = flagged[(flagged['horizon_hours'] >= window_start) & (flagged['horizon_hours'] <= window_end)]
                if not in_window.empty:
                    # pick "most important" flag: highest absolute z_score, tie-breaker by rel_jump
                    in_window_sorted = in_window.sort_values(by=['z_score','rel_jump'], ascending=[False, False])
                    top = in_window_sorted.iloc[0]

                    # Compose reason text
                    reasons = []
                    if abs(top['z_score']) >= z_thresh:
                        reasons.append(f"z-score {top['z_score']:.2f} >= {z_thresh}")
                    if top['rel_jump'] >= rel_thresh:
                        reasons.append(f"rel_jump {top['rel_jump']:.2f} >= {rel_thresh}")
                    reason_text = " & ".join(reasons) if reasons else "threshold exceeded"

                    # Print alert block
                    print("\n" + "-"*40)
                    print("   ---------------- ALERT NOTIFICATION -----------------------")
                    print(f"   Flag detected for window {window_start}→{window_end} hours ahead.")
                    print(f"   Most important flag:")
                    print(f"     Signal   : {top['signal']}")
                    print(f"     Time     : {top['forecast_time']}")
                    print(f"     Forecast : {top['forecast_value']:.3f}")
                    print(f"     z-score  : {top['z_score']:.3f}")
                    print(f"     rel_jump : {top['rel_jump']:.3f}")
                    print(f"     Reason   : {reason_text}")
                    print("   -----------------------------------------------------------")
                    print("\n   All flagged events in the chosen window:")
                    # Pretty-print the windowed flagged events
                    print(in_window[['signal','horizon_hours','forecast_time','forecast_value','z_score','rel_jump']].to_string(index=False))
                    print("-"*40 + "\n")
                    # Also save the windowed flagged events for quick reference
                    win_csv = f'flagged_window_{window_start}to{window_end}_anoms.csv'
                    in_window.to_csv(win_csv, index=False)
                    print(f"   Windowed flagged events saved to: {win_csv}")
                else:
                    print(f"\nNo flagged events found in the specified window ({window_start} to {window_end} hours).")
    else:
        print("Skipped upcoming-anomaly prediction.")
    # ---------------------------------------------------------------------------

    print("Done. You can re-run to try different thresholds or input files.")

# -------------------------
# Entry point
# -------------------------
if __name__ == '__main__':
    try:
        interactive()
    except KeyboardInterrupt:
        print("\nInterrupted by user. Exiting.")
        sys.exit(0)

def run_analysis_with_params(params):
    """
    Run analysis with parameters from web UI
    params: dict containing z_threshold, rel_threshold, run_prediction, horizon, window_start, window_end
            and optionally pune_path, aqi_path
    """
    import json
    from datetime import datetime
    
    try:
        print(f"Starting analysis with parameters: {params}")
        
        # Load datasets
        pune_path = params.get('pune_path')
        aqi_path = params.get('aqi_path')
        
        pune_df = load_csv_safe(pune_path, "Pune") if pune_path else None
        aqi_df = load_csv_safe(aqi_path, "AQI") if aqi_path else None

        if pune_df is None or aqi_df is None:
            print("Using demo data")
            pune_df, aqi_df = generate_demo_data()

        # Ensure timestamps
        if 'timestamp' not in pune_df.columns and 'LASTUPDATEDATETIME' in pune_df.columns:
            pune_df = pune_df.rename(columns={'LASTUPDATEDATETIME':'timestamp'})

        if 'timestamp' not in aqi_df.columns:
            print("AQI dataset lacks timestamp column — generating hourly index.")
            aqi_df['timestamp'] = pd.date_range(start='2024-01-01', periods=len(aqi_df), freq='h')

        # Merge data
        merged = hourly_align_merge_safe(pune_df, aqi_df)
        print(f"Merged timeseries rows: {len(merged)}")

        # Get parameters
        z_thresh = params.get('z_threshold', 3.0)
        rel_thresh = params.get('rel_threshold', 0.6)
        
        # Detect anomalies
        candidate_signals = [
            "PM2_MAX","PM2_MIN","PM10_MAX","PM10_MIN","NO_MAX","NO_MIN",
            "NO2_MAX","NO2_MIN","OZONE_MAX","OZONE_MIN","SO2_MAX","SO2_MIN",
            "CO_MAX","CO_MIN","AQI","PM2.5","PM10","NO2","CO","SO2","O3",
            "traffic_count","Vehicle Count","Industrial Activity Index","SOUND"
        ]
        signals = [s for s in candidate_signals if s in merged.columns]
        
        print(f"Monitoring {len(signals)} signals with z_threshold={z_thresh}, rel_threshold={rel_thresh}")
        
        anomaly_frames = []
        for sig in signals:
            try:
                df_slice = merged[['timestamp'] + [c for c in merged.columns if c == sig]]
                df_anom = detect_anomaly(df_slice, sig, z_threshold=z_thresh, jump_threshold=rel_thresh)
                if not df_anom.empty:
                    print(f" → {len(df_anom)} anomalies in {sig}")
                    anomaly_frames.append(df_anom)
            except Exception as e:
                print(f"Error detecting {sig}: {e}")

        # Fuse events
        if anomaly_frames:
            all_anoms = pd.concat(anomaly_frames).sort_values('timestamp').reset_index(drop=True)
            all_anoms['rounded'] = all_anoms['timestamp'].dt.round('60min')
            grouped = all_anoms.groupby('rounded').agg({
                'timestamp': ['min'],
                'signal': lambda s: ','.join(sorted(s.unique())),
                'value': 'max',
                'z_score': 'max',
                'jump': 'max'
            })
            grouped.columns = ['timestamp_min', 'signals', 'max_value', 'max_z', 'max_rel_change']
            grouped = grouped.reset_index(drop=True)
            events = pd.DataFrame({
                'event_time': grouped['timestamp_min'],
                'signals': grouped['signals'],
                'max_value': grouped['max_value'],
                'max_z': grouped['max_z'],
                'max_rel_change': grouped['max_rel_change']
            })
        else:
            events = pd.DataFrame(columns=['event_time','signals','max_value','max_z','max_rel_change'])

        # Save anomalies
        events.to_csv('anomalies.csv', index=False)
        print(f"Saved {len(events)} anomalies to anomalies.csv")

        # Run predictions if requested
        predictions_made = False
        preds = None
        if params.get('run_prediction', False):
            horizon = params.get('horizon', 6)
            window_start = params.get('window_start', 7)
            window_end = params.get('window_end', 12)
            
            print(f"Running predictions: horizon={horizon}, alert_window={window_start}-{window_end}")
            
            preds = predict_upcoming_anomalies(
                merged,
                horizon=horizon,
                recent_window=24,
                ewma_alpha=0.3,
                z_warn=z_thresh,
                rel_warn=rel_thresh,
                out_csv='predicted_upcoming_anoms.csv'
            )
            predictions_made = True
            
        # Save analysis summary
        summary = {
            'total_anomalies': len(events),
            'total_predictions': len(preds) if predictions_made and preds is not None else 0,
            'parameters_used': params,
            'signals_monitored': signals,
            'time_range': f"{merged['timestamp'].min()} to {merged['timestamp'].max()}",
            'analysis_time': datetime.now().isoformat()
        }
        
        with open('analysis_summary.json', 'w') as f:
            json.dump(summary, f, indent=2, default=str)
            
        print("Analysis completed successfully!")
        
    except Exception as e:
        print(f"Analysis failed: {e}")
        import traceback
        traceback.print_exc()
        
        # Save error information
        error_summary = {
            'error': str(e),
            'analysis_time': datetime.now().isoformat(),
            'parameters_used': params
        }
        with open('analysis_error.json', 'w') as f:
            json.dump(error_summary, f, indent=2)