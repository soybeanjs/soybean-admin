<script setup lang="ts">
import JsBarcode from 'jsbarcode';
import { onMounted } from 'vue';

const text = 'Soybean';

onMounted(() => {
  JsBarcode('#code39', 'Hello', { format: 'code39' });
  JsBarcode('#code128', text);
  JsBarcode('#ean-13', '1234567890128', { format: 'ean13' });
  JsBarcode('#upc-a', '123456789012', { format: 'upc' });
  JsBarcode('#barcode', 'Hello', {
    height: 30,
    lineColor: '#9ca3af'
  });
  JsBarcode('#barcode1', text, {
    background: '#9ca3af',
    lineColor: '#ffffff'
  });
  JsBarcode('#barcode2', text, {
    fontSize: 40
  });
  JsBarcode('#barcode3', 'Hi', {
    textMargin: 30,
    width: 4
  });
  JsBarcode('#barcode4', text, {
    textPosition: 'top',
    fontOptions: 'bold'
  });
});
</script>

<template>
  <div>
    <NCard title="条形码" :bordered="false" class="h-full card-wrapper">
      <NGrid cols="s:1 m:1 l:3" x-gap="12px" y-gap="24px" responsive="screen" item-responsive class="grid-wrapper">
        <NGi>
          CODE 39 正常尺寸
          <svg id="code39" />
        </NGi>
        <NGi>
          CODE 128 正常尺寸
          <svg id="code128" />
        </NGi>
        <NGi>
          ENA-13 商品条形码
          <svg id="ean-13" />
        </NGi>
        <NGi>
          UPC-A 商品条形码
          <svg id="upc-a" />
        </NGi>
        <NGi>
          不一样的高度，不一样的颜色
          <svg id="barcode" />
        </NGi>
        <NGi>
          加个背景色
          <svg id="barcode1" />
        </NGi>
        <NGi>
          字体好大
          <svg id="barcode2" />
        </NGi>
        <NGi>
          粗狂的条码，文字离远点
          <svg id="barcode3" />
        </NGi>
        <NGi>
          字体跑上面来，还是粗体
          <svg id="barcode4" />
        </NGi>
      </NGrid>
    </NCard>
  </div>
</template>

<style scoped>
.grid-wrapper {
  display: flex;
  flex-wrap: wrap;
}
.grid-wrapper > div {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
