<script setup lang="ts">
import { reactive } from 'vue';
import { {{apiModule}}Api } from '@/api';
import { detailSchema, PAGE_NAME } from '../data';
import useDrawer from '@/hooks/useDrawer.ts';

type DetailMethod = typeof {{apiModule}}Api.{{apiDetailMethod}};
type DetailRes = Awaited<ReturnType<DetailMethod>>['data'];

const { drawer } = useDrawer(PAGE_NAME);

const detail = reactive<Partial<DetailRes>>({});

const getDetail = async () => {
  const recordId = drawer.record?.{{recordKey}};
  if (!recordId) return;
  const { data } = await {{apiModule}}Api.{{apiDetailMethod}}(recordId);
  Object.assign(detail, (data || {}) as DetailRes);
};

const init = async () => {
  try {
    drawer.showSpinning();
    await getDetail();
  } finally {
    drawer.hideSpinning();
  }
};

init();
</script>

<template>
  <div>
    <yc-description :data="detail" :schema="detailSchema" title="Basic Info" />
  </div>
</template>

<style scoped lang="less"></style>
