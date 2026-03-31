import type { DescItem } from '@/components/Description/types.ts';

export const PAGE_NAME = '{{pageName}}';

export const columns = [
  {{#each columns}}
  {
    title: '{{title}}',
    dataIndex: '{{dataIndex}}',
    {{#if width}}width: {{width}},{{/if}}
    {{#if align}}align: '{{align}}',{{/if}}
    {{#if ellipsis}}ellipsis: true,{{/if}}
    {{#if fixed}}fixed: '{{fixed}}',{{/if}}
  }{{#unless @last}},{{/unless}}
  {{/each}}
];

{{#if optionsBlocks}}
{{{optionsBlocks}}}

{{/if}}
export const searchSchema: YcForm.Schema[] = [
  {{#each searchSchema}}
  {
    {{#if (isArray field)}}
    field: {{{json field}}},
    {{else}}
    field: '{{field}}',
    {{/if}}
    component: '{{component}}',
    componentProps: {
      {{#if placeholder}}placeholder: '{{placeholder}}',{{/if}}
      {{#if options}}options: {{options}},{{/if}}
      {{#if componentProps}}{{{componentProps}}},{{/if}}
    },
  }{{#unless @last}},{{/unless}}
  {{/each}}
];

export const detailSchema: DescItem[] = [
  {{#each detailSchema}}
  {
    label: '{{label}}',
    key: '{{key}}',
    {{#if span}}span: {{span}},{{/if}}
    {{#if tip}}tip: '{{tip}}',{{/if}}
    {{#if ellipsis}}ellipsis: true,{{/if}}
    {{#if customRender}}customRender: {{{customRender}}},{{/if}}
  }{{#unless @last}},{{/unless}}
  {{/each}}
];
