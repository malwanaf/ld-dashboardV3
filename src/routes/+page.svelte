<script lang="ts">
    import { strikesresult } from "$lib/stores/strikes";
    import { dbstatus } from "$lib/stores/dbstatus";


</script>

<ul>
    {#each $strikesresult as strike}
    <li></li>
    {/each}
</ul>