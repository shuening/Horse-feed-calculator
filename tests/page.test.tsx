import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import HomePage from '../app/page';

describe('HomePage UI requirements', () => {
  it('shows the required horse, goal, and symptom input controls', () => {
    render(<HomePage />);

    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /Weight gain/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /Maintain/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /Weight loss/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /Poor teeth/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /Sensitive digestion/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /Not finishing feed/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /^PSSM/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /Insulin Resistant/i })).toBeInTheDocument();
  });

  it('resets goal and symptoms when the selected horse changes', async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    await user.click(screen.getByRole('radio', { name: /Weight loss/i }));
    await user.click(screen.getByRole('checkbox', { name: /Insulin Resistant/i }));

    const horseSelect = screen.getByRole('combobox');
    await user.selectOptions(horseSelect, 'odinn');

    expect(screen.getByRole('radio', { name: /Maintain/i })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: /Insulin Resistant/i })).not.toBeChecked();
  });

  it('shows the Barn card sections including Symptom toggle section after Summary', async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    await user.click(screen.getByRole('checkbox', { name: /Insulin Resistant/i }));

    const headings = screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent);
    const summaryIndex = headings.indexOf('Summary');
    const symptomIndex = headings.indexOf('Symptom toggle section');

    expect(summaryIndex).toBeGreaterThanOrEqual(0);
    expect(symptomIndex).toBeGreaterThan(summaryIndex);
  });

  it('updates the Symptom toggle section content immediately when a symptom is checked', async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    const symptomSection = screen.getByRole('heading', { name: 'Symptom toggle section' }).closest('section');
    const initialContent = symptomSection?.textContent;

    await user.click(screen.getByRole('checkbox', { name: /Insulin Resistant/i }));

    expect(symptomSection?.textContent).not.toBe(initialContent);
  });

  it('shows all required Barn card content sections', async () => {
    const user = userEvent.setup();
    render(<HomePage />);
    await user.click(screen.getByRole('checkbox', { name: /^PSSM/i }));

    expect(screen.getByText('Known weight')).toBeInTheDocument();
    expect(screen.getByText('Starting forage target')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Horse notes' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Baseline plan' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Feed' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Supplements' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Summary' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Symptom toggle section' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Suggested adjustments' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Warnings' })).toBeInTheDocument();
  });

  it('changes feed and supplement output when inputs change', async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    const horseSelect = screen.getByRole('combobox');
    await user.selectOptions(horseSelect, 'odinn');

    const feedHeading = screen.getByRole('heading', { name: 'Feed' });
    const supplementsHeading = screen.getByRole('heading', { name: 'Supplements' });
    const feedSection = feedHeading.closest('section');
    const supplementsSection = supplementsHeading.closest('section');

    const initialFeed = feedSection?.textContent;
    const initialSupplements = supplementsSection?.textContent;

    await user.click(screen.getByRole('checkbox', { name: /Sensitive digestion/i }));

    expect(feedSection?.textContent).not.toBe(initialFeed);
    expect(supplementsSection?.textContent).not.toBe(initialSupplements);
  });

  it('shows exactly the required horse options', () => {
    render(<HomePage />);

    const horseSelect = screen.getByRole('combobox');
    const optionTexts = within(horseSelect).getAllByRole('option').map((option) => option.textContent?.replace(/\s+/g, ' ').trim());
    expect(optionTexts).toEqual([
      'Tenor (700 lb)',
      'Odinn (700 lb)',
      'Spoi (950 lb)',
      'Uffie (800 lb)',
    ]);
  });
});
