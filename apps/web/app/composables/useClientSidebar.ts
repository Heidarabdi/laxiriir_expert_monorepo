import { ref } from "vue";

const isCollapsed = ref(false);

export function useClientSidebar() {
	function toggle() {
		isCollapsed.value = !isCollapsed.value;
	}

	return {
		isCollapsed,
		toggle,
	};
}
