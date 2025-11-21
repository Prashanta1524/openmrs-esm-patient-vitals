import useSWR from 'swr';

import { openmrsFetch, restBaseUrl, showToast } from '@openmrs/esm-framework';
import { type FormSchema } from '@openmrs/esm-form-engine-lib';
import { useEffect } from 'react';

/**
 * Custom hook to fetch form schema based on its form UUID.
 *
 * @param formUuid - The UUID of the form to retrieve the schema for
 * @returns An object containing the form schema, error, and loading state
 */
const useFormSchema = (formUuid: string) => {
  const url = formUuid ? `${restBaseUrl}/o3/forms/${formUuid}` : null;

  const { data, error, isLoading } = useSWR<{ data: FormSchema }>(url, openmrsFetch);

  // Add debugging to help identify form loading issues
  useEffect(() => {
    if (isLoading) {
      console.log(`[Form Debug] Loading form schema for UUID: ${formUuid}`);
      console.log(`[Form Debug] API URL: ${url}`);
    }

    if (error) {
      console.error(`[Form Debug] Error loading form: ${error.message}`);
      console.error('[Form Debug] Error details:', error);

      // Check if it's a 404 error (form not found)
      if (error.response?.status === 404) {
        console.error(
          `[Form Debug] Form with UUID ${formUuid} was not found. Please verify the form exists in the system.`,
        );
        showToast({
          title: 'Form Not Found',
          description: `The form with UUID "${formUuid}" was not found. Please check if the form exists and is published.`,
          kind: 'error',
        });
      } else {
        showToast({
          title: 'Form Error',
          description: `Could not load form (UUID: ${formUuid}). Error: ${error.message}`,
          kind: 'error',
        });
      }
    }

    if (data) {
      console.log(`[Form Debug] Form schema loaded successfully for UUID: ${formUuid}`);
      console.log('[Form Debug] Form schema data:', data.data);

      if (!data.data) {
        console.warn('[Form Debug] Form data is empty or invalid');
        showToast({
          title: 'Form Warning',
          description: 'Form loaded but schema may be invalid or empty',
          kind: 'warning',
        });
      } else {
        console.log(
          '[Form Debug] Form has these sections:',
          data.data.pages?.map((page) => page.label),
        );
      }
    }
  }, [formUuid, url, isLoading, error, data]);

  const schema = { ...data?.data, encounterType: data?.data?.encounterType?.['uuid'] };

  return { schema, error, isLoading };
};

export default useFormSchema;
