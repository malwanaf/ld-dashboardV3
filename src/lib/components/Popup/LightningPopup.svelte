<script>
    import { fade } from 'svelte/transition';
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    
    export let strikesresult = writable([]);
    
    let visibleStrikes = [];
  
    // Subscribe to the strikesresult store
    strikesresult.subscribe(value => {
      visibleStrikes = [...value.slice().slice(-1)];
      removeLatestStrike();
    });
  
    // Function to remove the latest strike after 10 seconds
    function removeLatestStrike() {
      setTimeout(() => {
        visibleStrikes = [];
      }, 10000);
    }
  </script>
  
  <style>
    .alert-area {
      /* Your styles here */
    }
    .m-2 {
      margin: 2rem;
    }
    .border-opacity-10 {
      border-opacity: 10%;
    }
    .bg-opacity-70 {
      background-opacity: 70%;
    }
    .h-4 {
      height: 1rem;
    }
    .w-4 {
      width: 1rem;
    }
  </style>
  
  <div class="alert-area">
    {#each visibleStrikes as strike}
      <div out:fade={{ duration: 1000 }}>
        <Alert.Root
          variant="default"
          class="m-2 border-opacity-10 bg-opacity-70"
        >
          <ExclamationTriangle class="h-4 w-4" />
          <Alert.Title>Latest Strike</Alert.Title>
          <Alert.Description>
            {strike.time} - {strike.distance} km - <Badge>{strike.intensity}</Badge>
          </Alert.Description>
        </Alert.Root>
      </div>
    {/each}
  </div>
  