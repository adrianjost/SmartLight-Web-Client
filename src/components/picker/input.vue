<template>
  <div>
    <label>
      <span :class="{label: true, active: (value && value !== 0)}">{{label}}</span>
      <input
        :type="type"
        :value="value"
        :placeholder="placeholder"
        @input="update"
        :required="required"
      />
    </label>
    <small v-if="hint" v-html="hint" class="hint"/>
  </div>
</template>

<script>
export default {
  name: "SLInput",
  props: {
    value: {
      required: true
    },
    label: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: "text"
    },
    placeholder: {
      type: String,
      default: "text"
    },
    required: {
      type: Boolean,
      default: false
    },
    hint: {
      type: String
    }
  },
  methods: {
    update($event){
      this.$emit("input", $event.target.value);
    }
  }
}
</script>

<style lang="scss" scoped>
$input-padding-left: 12px;

label{
  display: block;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  margin: 1em 0 .75em;
  clear: both;
  position: relative;
}

.label{
  font-size: .75em;
  position: absolute;
  top: 0;
  transform: translateY(-.75em);
  left: $input-padding-left;
  background: var(--color-background);
  border-left: 1px solid var(--color-background);
  border-right: 1px solid var(--color-background);
}

input{
  width: 100%;
  background: transparent;
  border: 0;
  padding: 8px $input-padding-left;
  outline: none;
  transition: color .2s linear;
  &:focus{
    color: var(--color-text-active);
  }
}

.hint{
  display: block;
  margin-top: -.75em;
  margin-left: $input-padding-left;
  margin-bottom: 1em;
}
</style>