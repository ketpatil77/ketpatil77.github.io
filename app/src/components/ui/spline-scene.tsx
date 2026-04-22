import { Suspense, lazy, type ReactNode } from 'react';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';

const Spline = lazy(() => import('@splinetool/react-spline'));

interface SplineSceneProps {
  scene: string;
  className?: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  style?: React.CSSProperties;
  errorFallback?: ReactNode;
}

function SplineLoader({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className="flex items-center justify-center h-full w-full">
      <div
        className={`animate-spin rounded-full border-2 border-[var(--cyan-dim)] border-t-[var(--cyan-full)] ${sizeClasses[size]}`}
      />
    </div>
  );
}

function SplineErrorFallback({ resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center">
      <div className="mb-2 rounded-full bg-[var(--bg-elevated)] p-3">
        <svg
          className="h-6 w-6 text-[var(--cyan-dim)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <p className="text-sm font-medium text-[var(--text-200)]">
        3D Scene Failed to Load
      </p>
      <button
        onClick={resetErrorBoundary}
        className="mt-2 rounded-lg border border-[var(--border-dim)] bg-[var(--bg-surface)] px-3 py-1.5 text-xs text-[var(--text-300)] transition-colors hover:border-[var(--cyan-full)] hover:text-[var(--cyan-full)]"
      >
        Retry
      </button>
    </div>
  );
}

function SplineSceneFallback({ className }: { className?: string }) {
  return (
    <div className={`flex h-full w-full items-center justify-center ${className ?? ''}`}>
      <SplineLoader size="md" />
    </div>
  );
}

function SplineScene({ scene, className, onLoad, style, errorFallback }: SplineSceneProps) {
  return (
    <ErrorBoundary
      fallbackRender={(props) => (
        errorFallback !== undefined ? <>{errorFallback}</> : <SplineErrorFallback {...props} />
      )}
    >
      <Suspense fallback={<SplineSceneFallback className={className} />}>
        <Spline
          scene={scene}
          className={className}
          style={style}
          onLoad={onLoad}
        />
      </Suspense>
    </ErrorBoundary>
  );
}

export { SplineScene, SplineLoader, SplineErrorFallback, SplineSceneFallback };
export type { SplineSceneProps };
