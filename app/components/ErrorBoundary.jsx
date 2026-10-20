"use client";

import React from "react";

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, message: "", componentStack: "" };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, message: String(error?.message || error) };
    }

    componentDidCatch(error, info) {
        const payload = {
            message: String(error?.message || error),
            stack: String(error?.stack || ""),
            componentStack: String(info?.componentStack || ""),
        };
        this.setState({
            message: payload.message,
            componentStack: payload.componentStack,
        });
        try {
            console.error("[ErrorBoundary]", payload);
            fetch("/api/errorlog", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            }).catch(() => {});
        } catch {}
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: 40, fontFamily: "monospace", whiteSpace: "pre-wrap", color: "#b00020" }}>
                    <h2>Something went wrong</h2>
                    <h3>{this.state.message}</h3>
                    <pre style={{ fontSize: 12 }}>{this.state.componentStack}</pre>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;