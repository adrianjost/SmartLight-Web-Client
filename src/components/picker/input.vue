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

label {
  position: relative;
  display: block;
  margin: 1em 0 0.75em;
  clear: both;
  border: 1px solid var(--color-border);
  border-radius: 4px;
}

.label {
  position: absolute;
  top: 0;
  left: $input-padding-left;
  font-size: 0.75em;
  background: var(--color-background);
  border-right: 1px solid var(--color-background);
  border-left: 1px solid var(--color-background);
  transform: translateY(-0.75em);
}

input {
  width: 100%;
  padding: 8px $input-padding-left;
  background: transparent;
  border: 0;
  outline: none;
  transition: color 0.2s linear;

  &:focus {
    color: var(--color-text-active);
  }
}

.hint {
  display: block;
  margin-top: -0.75em;
  margin-bottom: 1em;
  margin-left: $input-padding-left;
}
</style>