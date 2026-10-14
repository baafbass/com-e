import { useCallback, useEffect, useRef, useState } from 'react';
import { getErrorMessage } from '../utils/errors';

/**
 * Runs `asyncFn` on mount and whenever a value in `deps` changes.
 * Returns `{ data, isLoading, error, reload, setData }`.
 */
export function useAsync(asyncFn, deps = []) {
  const [state, setState] = useState({ data: null, isLoading: true, error: null });
  const asyncFnRef = useRef(asyncFn);
  asyncFnRef.current = asyncFn;

  const [reloadCount, setReloadCount] = useState(0);
  const reload = useCallback(() => setReloadCount((count) => count + 1), []);

  useEffect(() => {
    let isActive = true;
    setState((previous) => ({ ...previous, isLoading: true, error: null }));

    asyncFnRef
      .current()
      .then((data) => isActive && setState({ data, isLoading: false, error: null }))
      .catch((error) => isActive && setState({ data: null, isLoading: false, error: getErrorMessage(error) }));

    return () => {
      isActive = false;
    };
    // `deps` is the caller's dependency list, like useEffect's.
  }, [...deps, reloadCount]); // eslint-disable-line react-hooks/exhaustive-deps

  const setData = useCallback((updater) => {
    setState((previous) => ({
      ...previous,
      data: typeof updater === 'function' ? updater(previous.data) : updater,
    }));
  }, []);

  return { ...state, reload, setData };
}
