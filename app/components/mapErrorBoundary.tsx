"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { MdErrorOutline } from "react-icons/md";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class MapErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Map rendering error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-slate-50 p-6 text-center border-2 border-dashed border-slate-200">
          <MdErrorOutline className="text-6-xl text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Gagal Memuat Peta</h2>
          <p className="text-slate-600 mb-4 max-w-md">
            Terjadi kesalahan teknis saat mencoba merender peta. Ini mungkin disebabkan oleh data geografis yang tidak valid atau gangguan pada layanan peta.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default MapErrorBoundary;
