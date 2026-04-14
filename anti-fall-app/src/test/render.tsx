import { ReactElement } from 'react';
import { render } from '@testing-library/react';

export function renderUI(ui: ReactElement) {
  return render(ui);
}
