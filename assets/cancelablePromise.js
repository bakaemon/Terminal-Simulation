class CancelablePromise extends Promise {
    constructor(executor) {
        let cancel;

        super((resolve, reject) => {
            executor(resolve, reject, () => {
                if (cancel) {
                    cancel();
                }
            });
        });

        this.cancel = (cancelCallback) => {
            cancel = cancelCallback;
        };
    }
}