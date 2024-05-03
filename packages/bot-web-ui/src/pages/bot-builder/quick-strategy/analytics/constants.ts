import { TFormValues } from '../types';

export const form_name = 'ce_bot_form';
export const STORED_ITEM_NOT_FOUND = 'No results found';

export enum ACTION {
    OPEN = 'open',
    CLOSE = 'close',
    CHOOSE_STRATEGY_TYPE = 'choose_strategy_type',
    SWITCH_QUICK_STRATEGY_TAB = 'switch_quick_strategy_tab',
    RUN_QUICK_STRATEGY = 'run_quick_strategy',
    EDIT_QUICK_STRATEGY = 'edit_quick_strategy',
    SELECT_QUICK_STRATEGY_GUIDE = 'select_quick_strategy_guide',
}

export type TFormStrategy = {
    form_values: TFormValues;
} & TSelectedStrategy;

export type TSelectedStrategy = {
    selected_strategy: string;
};
