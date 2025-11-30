const updateURLParams = (key: string, value: string) => {
        const params = new URLSearchParams(window.location.search);

        if (value.length > 0) {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        window.history.replaceState(
            {},
            "",
            `${window.location.pathname}?${params.toString()}`
        );
    }

export default updateURLParams;