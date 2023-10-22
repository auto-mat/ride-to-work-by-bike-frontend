<script lang='ts'>
/**
* CountdownChallenge Component
*
* The `CountdownChallenge` displays a countdown to the end of the challenge.
*
* @description * Use this component to display countdown when the challenge
* is about to end.
*
* Note: This component is commonly used on Homepage.
*
* @props
* - `dateEnd` (String, required): Date when challenge ends.
*   It should be a string represenation of date object.
*
* @example
* <countdown-challenge />
*
* @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=6021%3A22987&mode=dev)
*/

import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CountdownChallenge',
  props: {
    dateEnd: {
      type: String,
      required: true,
    }
  }
})
</script>

<template>
  <div>

  </div>
</template>

<style scoped lang="scss">
</style>
