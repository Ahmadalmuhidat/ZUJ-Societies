import { useEffect, useRef, useCallback, useState } from 'react';
import { toast } from 'react-toastify';

export function useAutoSave(saveFunction, data, delay = 1000) {
  const timeoutRef = useRef(null);
  const previousDataRef = useRef(data);
  const isFirstRender = useRef(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  const debouncedSave = useCallback(async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        setIsSaving(true);
        await saveFunction();
        setLastSaved(new Date());
        
      } catch (error) {
        console.error('Auto-save failed:', error);
        toast.error('Failed to save settings automatically');
      } finally {
        setIsSaving(false);
      }
    }, delay);
  }, [saveFunction, delay]);

  useEffect(() => {
    if (data === null) {
      return;
    }

    if (isFirstRender.current) {
      isFirstRender.current = false;
      previousDataRef.current = data;
      return;
    }

    const hasChanged = JSON.stringify(data) !== JSON.stringify(previousDataRef.current);
    
    if (hasChanged) {
      previousDataRef.current = data;
      debouncedSave();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, debouncedSave]);

  return { debouncedSave, isSaving, lastSaved };
}
