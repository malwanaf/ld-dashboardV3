<script>
	import '../app.css';
    import socket from '$lib/socket';
	import { dbstatus } from '$lib/stores/dbstatus';
	import { ModeWatcher } from "mode-watcher";
</script>

<ModeWatcher />
<slot></slot>

<style></style>
