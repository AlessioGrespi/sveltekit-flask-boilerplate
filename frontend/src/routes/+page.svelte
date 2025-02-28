<script>
    // Declare result as a writable variable to store the response data
    let result = '';
    let isLoading = false;
    let error = null;
  
    async function fetchData() {
      console.log("Button pressed");
      isLoading = true;
      error = null;
      
      try {
        const response = await fetch(`/api/ping`);
        
        if (!response.ok) {
          throw new Error(`Network error: ${response.status} ${response.statusText}`);
        }
        
        // Parse the JSON and store it in result
        const data = await response.json();
        result = data;
        console.log(result);
      } 
      catch (err) {
        console.error("Error:", err.message);
        error = err.message;
      }
      finally {
        isLoading = false;
      }
    }
  </script>
  
  <button 
    type='button' 
    on:click={fetchData} 
    class='p-4 bg-amber-600 font-semibold text-2xl rounded-xl m-4'
    disabled={isLoading}
  >
    {isLoading ? 'Loading...' : 'Test'}
  </button>
  
  {#if error}
    <div class="text-red-500 p-4">
      Error: {error}
    </div>
  {:else if result}
    <div class="p-4">
      <h3 class="font-bold">Result:</h3>
      <pre class="bg-gray-100 p-2 rounded">{JSON.stringify(result, null, 2)}</pre>
    </div>
  {/if}