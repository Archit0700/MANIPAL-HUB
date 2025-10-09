import * as PhotoSphereViewer from 'photo-sphere-viewer';

type ViewerConstructor = new (...args: any[]) => {
  destroy: () => void;
  setPanorama: (path: string, options?: unknown) => Promise<unknown>;
  prop?: { loadingPromise?: Promise<unknown> | null };
};

const Viewer = (PhotoSphereViewer as unknown as { Viewer: ViewerConstructor }).Viewer;

type InternalViewer = InstanceType<typeof Viewer> & {
  __destroyed?: boolean;
  __destroyPending?: boolean;
  // The library stores internal promises on a non-public `prop` object.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prop?: { loadingPromise?: Promise<unknown> | null } & Record<string, any>;
};

const originalDestroy = Viewer.prototype.destroy;

Viewer.prototype.destroy = function patchedDestroy(this: InternalViewer) {
  if (this.__destroyed || this.__destroyPending) {
    return;
  }

  const finalize = () => {
    if (this.__destroyed) {
      return;
    }

    this.__destroyPending = false;
    this.__destroyed = true;
    originalDestroy.call(this);
  };

  const loadingPromise = this.prop?.loadingPromise ?? null;

  if (loadingPromise) {
    this.__destroyPending = true;
    loadingPromise.finally(finalize).catch(() => {
      // Ignore errors during shutdown; final cleanup still needs to run.
      finalize();
    });
  } else {
    finalize();
  }
};

export { Viewer };
