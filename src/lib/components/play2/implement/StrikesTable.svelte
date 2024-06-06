<script>
    import Sun from 'svelte-radix/Sun.svelte';
    import Moon from 'svelte-radix/Moon.svelte';
    import CaretSort from 'svelte-radix/CaretSort.svelte';
    import { toggleMode } from 'mode-watcher';
    import { Button } from '$lib/components/ui/button';
    import * as Table from '$lib/components/ui/table';
    import * as Pagination from '$lib/components/ui/pagination';
    import Reload from 'svelte-radix/Reload.svelte';
    import { Label } from '$lib/components/ui/label';
    import * as Select from '$lib/components/ui/select';
    import { strikesresult } from '$lib/stores/strikes';
    import { dbstatus } from '$lib/stores/dbstatus';
    import { specificstrikesresult } from '$lib/stores/specificStrike';

    // Implement isActive (from MainComponent.svelte)
    import { toggleIsActive } from '$lib/components/play2/toggleIsActive';
    let items;
  
    $: items = $strikesresult;
    // end of Implement isActive

    let currentPage = 1;
    let itemsPerPage = 10;
    let rowsPerPageOptions = [5, 10, 20, 50];
    let isLoading = false;
    let latestStrike = '';
    let sortBy = 'time';
    let sortOrder = 'ASC';

    $: console.log($dbstatus);
    $: latestStrike = $strikesresult.length ? $strikesresult[$strikesresult.length - 1] : null;

    function handleItemsPerPageChange(event) {
        itemsPerPage = parseInt(event.detail);
        currentPage = 1;
    }

    function exportToCSV() {
        try {
            if (!$strikesresult.length) {
                console.error('No data to export');
                return;
            }

            const headers = Array.from(new Set($strikesresult.flatMap(Object.keys)));
            const csvContent = [
                headers.join(','),
                ...$strikesresult.map(item =>
                    headers.map(header =>
                        item[header] != null ? String(item[header]).replace(/"/g, '""') : ''
                    ).join(',')
                )
            ].join('\n');

            const encodedUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
            const link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute('download', 'data.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error exporting to CSV:', error);
        }
    }

    function handleSort(column) {
        if (sortBy === column) {
            sortOrder = sortOrder === 'ASC' ? 'DESC' : 'ASC';
        } else {
            sortBy = column;
            sortOrder = 'ASC';
        }

        $strikesresult = $strikesresult.slice().sort((a, b) => {
            if (sortOrder === 'ASC') {
                return a[column] > b[column] ? 1 : -1;
            } else {
                return a[column] < b[column] ? 1 : -1;
            }
        });
    }

    $: paginatedItems = $strikesresult.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);


    function showSpecificStrike(id) {
        console.log('showing strike with id:', id);
        specificstrikesresult.set($strikesresult.filter(strike => strike.id === id));
    }

    function hideSpecificStrike(id) {
        console.log('hiding strike with id:', id);
        specificstrikesresult.set($specificstrikesresult.filter(strike => strike.id != id));
    }

    function toggleShowSpecificStrike(id) {
        if ($specificstrikesresult.filter(strike => strike.id === id).length > 0) {
            hideSpecificStrike(id);
        } else {
            showSpecificStrike(id);
        }
    }

    function isStrikeVisible(id) {
        return $specificstrikesresult.filter(strike => strike.id === id).length > 0;
    }

    $: console.log($specificstrikesresult);

    function formatDateTime(dateStr) {
    let dateObj = new Date(dateStr);

    let options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'Asia/Jakarta',
      timeZoneName: 'short'
    };

    return dateObj.toLocaleString('id-ID', options);
  }
</script>

<div class="flex flex-col h-full overflow-hidden p-4">
    <div class="mb-2 flex flex-col sm:flex-row items-center justify-between">
        <div class="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
            <Button on:click={exportToCSV} class="mt-2 sm:mt-0" variant="default">Export to CSV</Button>
        </div>
        <div class="flex items-center space-x-2 mt-2 sm:mt-0">
            <span class="text-sm text-gray-600 dark:text-gray-200 w-full sm:w-auto">
                Latest Strike: {latestStrike ? latestStrike.time : 'N/A'}
            </span>
            <span class="flex items-center space-x-1">
                <span class="text-sm text-gray-500">DB:</span>
                <span class="h-3 w-3 rounded-full" style="background-color: {$dbstatus};"></span>
            </span>
            <Button on:click={toggleMode} variant="outline" size="icon">
                <Sun class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"/>
                <Moon class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"/>
                <span class="sr-only">Toggle theme</span>
            </Button>
        </div>
    </div>

    {#if isLoading}
        <div class="mt-8 flex flex-col items-center justify-center flex-grow">
            <Reload class="r-2 h-4 w-4 animate-spin" />
            <span class="ml-2 text-gray-900">Loading...</span>
        </div>
    {:else}
        <div class="flex flex-col flex-grow overflow-hidden">
            <div class="mb-2 flex items-center justify-between">
                <span class="text-gray-700 dark:text-gray-400 text-sm">Total Items: {$strikesresult.length}</span>
                
                <div class="flex items-center space-x-1 w-auto sm:w-auto">
                    <label for="itemsPerPage" class="mr-2 text-gray-700 dark:text-gray-400 text-sm">Rows per page:</label>
                    <Select.Root>
                        <Select.Trigger class="w-auto">
                            <Select.Value placeholder="10" />
                        </Select.Trigger>
                        <Select.Content on:change={handleItemsPerPageChange}>
                            {#each rowsPerPageOptions as option}
                                <Select.Item value={option} selected={option === itemsPerPage}>{option}</Select.Item>
                            {/each}
                        </Select.Content>
                    </Select.Root>
                </div>
            </div>
            <div class="flex-grow overflow-x-auto rounded-md border">
                <Table.Root class="text-md w-full">
                    <Table.Header>
                        <Table.Row>
                            <Table.Head class="text-left">ID</Table.Head>
                            <Table.Head class="text-left">
                                <Button class="text-left pl-0" variant="ghost" on:click={() => handleSort('time')}>
                                    Time<CaretSort class="ml-2 h-4 w-4" />
                                </Button>
                            </Table.Head>
                            <Table.Head class="text-left">
                                <Button class="text-left pl-0" variant="ghost" on:click={() => handleSort('distance')}>
                                    Distance<CaretSort class="h-4 w-4" />
                                </Button>
                            </Table.Head>
                            <Table.Head class="text-center">
                                <Button class="text-left pl-0" variant="ghost" on:click={() => handleSort('intensity')}>
                                    Intensity<CaretSort class="h-4 w-4" />
                                </Button>
                            </Table.Head>
                            <Table.Head class="text-center">
                                <Button class="text-left pl-0" variant="ghost">
                                    Actions
                                </Button>
                            </Table.Head>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {#if !$strikesresult || $strikesresult.length === 0}
                            <Table.Row>
                                <Table.Cell colspan="4" class="items-center">
                                    <div class="flex items-center space-x-2">
                                        <Reload class="mr-2 h-4 w-4 animate-spin" id="reload" />
                                        <Label for="reload" class="text-lg">Loading Data ...</Label>
                                    </div>
                                </Table.Cell>
                            </Table.Row>
                        {:else}
                            {#each paginatedItems as strike (strike.id)}
                                <Table.Row>
                                    <Table.Cell class="text-left">{strike.id}</Table.Cell>
                                    <Table.Cell class="text-left">{formatDateTime(strike.time)}</Table.Cell>
                                    <Table.Cell class="text-left">{strike.distance} km</Table.Cell>
                                    <Table.Cell class="text-center">{strike.intensity}</Table.Cell>
                                    <Table.Cell class="text-center">
                                        <Button class="w-20" on:click={() => toggleIsActive(strike.id)}>
                                            {strike.isActive ? 'Hide' : 'Show'}
                                        </Button>
                                    </Table.Cell>
                                </Table.Row>
                            {/each}
                        {/if}
                    </Table.Body>
                </Table.Root>
            </div>
            <div class="flex flex-col items-center justify-center">
                <div class="mt-4">
                    <Pagination.Root count={$strikesresult.length} perPage={itemsPerPage} let:pages>
                        <Pagination.Content>
                            <Pagination.Item>
                                <Pagination.PrevButton on:click={() => (currentPage = currentPage - 1)} disabled={currentPage === 1} />
                            </Pagination.Item>
                            {#each pages as page (page.key)}
                                {#if page.type === 'ellipsis'}
                                    <Pagination.Item>
                                        <Pagination.Ellipsis />
                                    </Pagination.Item>
                                {:else}
                                    <Pagination.Item>
                                        <Pagination.Link {page} on:click={() => (currentPage = page.value)} isActive={currentPage == page.value}>
                                            {page.value}
                                        </Pagination.Link>
                                    </Pagination.Item>
                                {/if}
                            {/each}
                            <Pagination.Item>
                                <Pagination.NextButton on:click={() => (currentPage = currentPage + 1)} disabled={currentPage === pages.length} />
                            </Pagination.Item>
                        </Pagination.Content>
                    </Pagination.Root>
                </div>
            </div>
        </div>
    {/if}
</div>
