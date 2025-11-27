export function wrapPromise<T>(promise: Promise<T>) {
    let status = 'pending';

    let result: T;

    let suspender = promise.then(
        (res) => {
            status = 'success';
            result = res;
        },
        (err) => {
            status = 'error';
            result = err;
        }
    );

    return {
        read(): T {
            switch (status) {
                case 'pending':
                    throw suspender;
                case 'error':
                    throw result;
            }

            return result
        }
    }
}