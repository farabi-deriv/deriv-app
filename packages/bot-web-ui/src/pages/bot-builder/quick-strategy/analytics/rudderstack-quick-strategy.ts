import { Analytics, TEvents } from '@deriv-com/analytics';
import { ACTION, form_name, type TFormStrategy, type TSelectedStrategy } from './constants';
import { getRsStrategyType, getSubpageName, getTradeParameterData } from './utils';

export const rudderStackSendQsOpenEvent = ({ subform_source }: TEvents['ce_bot_form']) => {
    Analytics.trackEvent('ce_bot_form', {
        action: ACTION.OPEN,
        form_name,
        subpage_name: getSubpageName(),
        subform_name: 'quick_strategy',
        subform_source,
    });
};

export const rudderStackSendQsCloseEvent = ({
    quick_strategy_tab,
    selected_strategy,
}: TEvents['ce_bot_form'] & TFormStrategy) => {
    Analytics.trackEvent('ce_bot_form', {
        action: ACTION.CLOSE,
        form_name,
        subpage_name: getSubpageName(),
        subform_name: 'quick_strategy',
        quick_strategy_tab,
        strategy_name: getRsStrategyType(selected_strategy),
    });
};

export const rudderStackSendQsRunStrategyEvent = ({
    form_values,
    selected_strategy,
}: TEvents['ce_bot_form'] & TFormStrategy) => {
    Analytics.trackEvent('ce_bot_form', {
        action: ACTION.RUN_QUICK_STRATEGY,
        form_name,
        subform_name: 'quick_strategy',
        ...getTradeParameterData({ form_values, selected_strategy }),
    });
};

export const rudderStackSendQsEditStrategyEvent = ({
    form_values,
    selected_strategy,
}: TEvents['ce_bot_form'] & TFormStrategy) => {
    Analytics.trackEvent('ce_bot_form', {
        action: ACTION.EDIT_QUICK_STRATEGY,
        form_name,
        subform_name: 'quick_strategy',
        ...getTradeParameterData({ form_values, selected_strategy }),
    });
};

export const rudderStackSendQsSelectedTabEvent = ({ quick_strategy_tab }: TEvents['ce_bot_form']) => {
    Analytics.trackEvent('ce_bot_form', {
        action: ACTION.SWITCH_QUICK_STRATEGY_TAB,
        form_name,
        subform_name: 'quick_strategy',
        quick_strategy_tab,
    });
};

export const rudderStackSendSelectQsStrategyGuideEvent = ({ selected_strategy }: TSelectedStrategy) => {
    Analytics.trackEvent('ce_bot_form', {
        action: ACTION.SELECT_QUICK_STRATEGY_GUIDE,
        form_name,
        subpage_name: getSubpageName(),
        strategy_name: getRsStrategyType(selected_strategy),
    });
};

export const rudderStackSendTutorialSearchEvent = ({ search_term }: TEvents['ce_bot_form']) => {
    Analytics.trackEvent('ce_bot_form', {
        action: 'search',
        form_name: 'ce_bot_form',
        subpage_name: getSubpageName(),
        search_term,
    });
};

export const rudderStackSendRunBotEvent = () => {
    Analytics.trackEvent('ce_bot_form', {
        action: ACTION.RUN_BOT,
        form_name,
        subpage_name: getSubpageName(),
    });
};
