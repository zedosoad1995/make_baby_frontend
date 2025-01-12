export default {
  beforeMount(el: HTMLElement) {
    el.addEventListener('mouseover', () => el.focus())
    el.addEventListener('mouseleave', () => el.blur())
  },
  beforeUnmount(el: HTMLElement) {
    el.removeEventListener('mouseover', () => el.focus())
    el.removeEventListener('mouseleave', () => el.blur())
  },
}
