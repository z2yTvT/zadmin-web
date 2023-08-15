import useStore from '@/store';

export default {
  inserted(el, binding) {
    const roles = useStore.getters.roles;
    const perms = useStore.getters.perms;
    if (roles.includes('admin')) {
      return true;
    }
    const value = binding.value;
    if (value) {
      const requiredPerms = value;
      const hasPerm = perms.some((perm) => {
        return requiredPerms.includes(perm);
      });
      if (!hasPerm) {
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
      }
    } else {
      throw new Error("权限操标识符为空！");
    }
  }
}




