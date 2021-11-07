### css书写顺序

1. 定位属性：

   `position display float left top right bottom overflow clear z-index`

2. 自身属性：

   `width height padding border margin background`

3. 文字样式：

   `font-family font-size font-style font-weight font-varient color`

4. 文本属性：

   `text-align vertical-align text-wrap text-transform text-indent text-decoration letter-spacing word-spacing white-space text-overflow`

5. css3中新增属性：

   `content box-shadow border-radius transform`

#### class类名的顺序：

1. 自定义的class类名(遵循BEM命名法)
2. css插件提供的类名按照以上的css属性对应的顺序

例如：自定义类名结合tailwind css

<div class="demo-container absolute flex justify-center items-center left-10px top-12px overflow-hidden wh-full p-10px border-1px border-[#f00] m-24px bg-[#fff] text-32px text-[#0f0]"></div>
<style>
	.demo-container {
		box-shadow: 2px 0 8px 0 rgb(29 35 41 / 5%);
	}
</style>
