import React from 'react';
import classNames from 'classnames';
import { Field as FormField, Formik, Form, FieldProps } from 'formik';
import { Input, Icon, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { ToolboxItems } from './toolbox-items';
import { connect } from '../../../../stores/connect';
import RootStore from 'Stores/index.js';

interface SearchBoxProps {
    is_search_loading: boolean;
    onSearch: () => void;
    onSearchBlur: () => void;
    onSearchClear: (param: (field: string, value: any, shouldValidate?: boolean | undefined) => void) => void;
    onSearchKeyUp: (param: () => void) => void;
}
type TFormValues = { [key: string]: string };

const SearchBox = ({ is_search_loading, onSearch, onSearchBlur, onSearchClear, onSearchKeyUp }: SearchBoxProps) => (
    <div className='db-toolbox__search'>
        <Formik initialValues={{ search: '' }} onSubmit={onSearch}>
            {({ submitForm, values: { search }, setFieldValue }) => (
                <Form>
                    <FormField name='search'>
                        {({ field }: FieldProps<string, TFormValues>) => (
                            <Input
                                {...field}
                                className='db-toolbox__search-field'
                                type='text'
                                name='search'
                                placeholder={localize('Search')}
                                onKeyUp={() => onSearchKeyUp(submitForm)}
                                onFocus={submitForm}
                                onBlur={onSearchBlur}
                                leading_icon={
                                    (search &&
                                        (is_search_loading ? (
                                            <div className='loader' />
                                        ) : (
                                            <Icon
                                                icon='IcCloseCircle'
                                                onClick={() => onSearchClear(setFieldValue)}
                                                color='secondary'
                                            />
                                        ))) ||
                                    (!search && <Icon icon='IcSearch' />)
                                }
                            />
                        )}
                    </FormField>
                </Form>
            )}
        </Formik>
    </div>
);

interface ToolboxProps {
    hasSubCategory: () => boolean;
    is_mobile: boolean;
    is_search_loading: boolean;
    is_toolbox_open: boolean;
    onMount: (param?: React.RefObject<typeof ToolboxItems>) => void;
    onSearch: () => void;
    onSearchBlur: () => void;
    onSearchClear: () => void;
    onSearchKeyUp: () => void;
    onToolboxItemClick: () => void;
    onToolboxItemExpand: (index: number) => void;
    onUnmount: () => void;
    sub_category_index: any;
    toggleDrawer: () => void;
    toolbox_dom: React.ReactElement[];
}

const Toolbox = ({
    onMount,
    onUnmount,
    hasSubCategory,
    is_mobile,
    is_search_loading,
    is_toolbox_open,
    onSearch,
    onSearchBlur,
    onSearchClear,
    onSearchKeyUp,
    onToolboxItemClick,
    onToolboxItemExpand,
    sub_category_index,
    toggleDrawer,
    toolbox_dom,
}: ToolboxProps) => {
    const toolbox_ref = React.useRef(ToolboxItems);
    const [is_open, setOpen] = React.useState(true);

    React.useEffect(() => {
        onMount(toolbox_ref);
        return () => onUnmount();
    }, [onMount, onUnmount]);

    if (is_mobile) {
        return null;
    }

    return (
        <div className='dashboard__toolbox'>
            <div id='gtm-toolbox' className='db-toolbox__content'>
                <div className='db-toolbox__header'>
                    <div className='db-toolbox__title' onClick={() => setOpen(!is_open)}>
                        {localize('Blocks menu')}
                        <span className={classNames('chevron', { active: is_open })}>
                            <Icon icon='IcChevronDownBold' />
                        </span>
                    </div>
                </div>
                <div className={classNames('db-toolbox__content-wrapper', { active: is_open })}>
                    <SearchBox
                        is_search_loading={is_search_loading}
                        onSearch={onSearch}
                        onSearchBlur={onSearchBlur}
                        onSearchClear={onSearchClear}
                        onSearchKeyUp={onSearchKeyUp}
                    />
                    <div className='db-toolbox__category-menu'>
                        {toolbox_dom &&
                            Array.from(toolbox_dom.childNodes).map((category, index) => {
                                if (category.tagName.toUpperCase() === 'CATEGORY') {
                                    const has_sub_category = hasSubCategory(category.children);
                                    const is_sub_category_open = sub_category_index.includes(index);
                                    return (
                                        <div
                                            key={`db-toolbox__row--${category.getAttribute('id')}`}
                                            className='db-toolbox__row'
                                        >
                                            <div
                                                className='db-toolbox__item'
                                                onClick={() => {
                                                    // eslint-disable-next-line no-unused-expressions
                                                    has_sub_category
                                                        ? onToolboxItemExpand(index)
                                                        : onToolboxItemClick(category);
                                                }}
                                            >
                                                <div className='db-toolbox__category-text'>
                                                    <div className='db-toolbox__label'>
                                                        {localize(category.getAttribute('name'))}
                                                    </div>
                                                    {has_sub_category && (
                                                        <div
                                                            className={classNames('db-toolbox__category-arrow', {
                                                                'db-toolbox__category-arrow--active':
                                                                    is_sub_category_open,
                                                            })}
                                                        >
                                                            <Icon icon='IcChevronDownBold' />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            {has_sub_category &&
                                                is_sub_category_open &&
                                                Array.from(category.childNodes).map(subCategory => {
                                                    return (
                                                        <div
                                                            key={`db-toolbox__sub-category-row--${subCategory.getAttribute(
                                                                'id'
                                                            )}`}
                                                            className='db-toolbox__sub-category-row'
                                                            onClick={() => {
                                                                onToolboxItemClick(subCategory);
                                                            }}
                                                        >
                                                            <Text size='xxs' line_height='m'>
                                                                {localize(subCategory.getAttribute('name'))}
                                                            </Text>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    );
                                }
                                return null;
                            })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default connect(({ toolbox, ui }: RootStore) => ({
    hasSubCategory: toolbox.hasSubCategory,
    is_mobile: ui.is_mobile,
    is_search_loading: toolbox.is_search_loading,
    is_toolbox_open: toolbox.is_toolbox_open,
    onMount: toolbox.onMount,
    onSearch: toolbox.onSearch,
    onSearchBlur: toolbox.onSearchBlur,
    onSearchClear: toolbox.onSearchClear,
    onSearchKeyUp: toolbox.onSearchKeyUp,
    onToolboxItemClick: toolbox.onToolboxItemClick,
    onToolboxItemExpand: toolbox.onToolboxItemExpand,
    onUnmount: toolbox.onUnmount,
    sub_category_index: toolbox.sub_category_index,
    toggleDrawer: toolbox.toggleDrawer,
    toolbox_dom: toolbox.toolbox_dom,
}))(Toolbox);
