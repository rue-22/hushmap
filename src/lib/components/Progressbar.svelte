<script lang="ts">
    let { color, level, noise, desc } = $props()
    let bgColor = $state("")
    let textColor = $state("")

    if (color == 'quiet-green') {
        bgColor = 'bg-quiet-green';
        textColor = 'text-quiet-green';
    } else if (color == 'loud-orange') {
        bgColor = 'bg-loud-orange';
        textColor = 'text-loud-orange';
    } else {
        bgColor = 'bg-very-loud-red'
        textColor = 'text-very-loud-red';
    }

    const noiseRanges = [
        { min: 0, max: 20, desc: "Threshold of Hearing" },
        { min: 20, max: 30, desc: "Silent Study Room" },
        { min: 30, max: 40, desc: "North Rim of Grand Canyon" },
        { min: 40, max: 60, desc: "Soft Whisper" },
        { min: 60, max: 70, desc: "Urban Residence" },
        { min: 70, max: 80, desc: "Normal Conversation" },
        { min: 80, max: 90, desc: "Classroom Noise" },
        { min: 90, max: 100, desc: "Train" },
        { min: 100, max: 110, desc: "Boiler Room" },
        { min: 110, max: 120, desc: "Construction Site" },
        { min: 120, max: 130, desc: "Night Club" },
        { min: 130, max: 140, desc: "Operating Heavy Equipment" },
        { min: 140, max: 150, desc: "Jet Taking Off" },
        { min: 150, max: Infinity, desc: "Treshold of Pain" }
    ];

    function getNoiseComparison(noise: number) {
        const found = noiseRanges.find(r => noise >= r.min && noise < r.max)
        return found ? found.desc : "Unknown"
    };

    let comparison = $derived(getNoiseComparison(noise))
</script>

<div class="flex justify-between mb-1">
  <span class="text-lg font-medium text-blue-700 dark:text-white">Point is <span class="italic {textColor}">{desc}</span> like
    {#if 'aeiouAEIOU'.includes((comparison ?? '')[0] || '')}
        an
    {:else}
        a
    {/if}
     <span class="italic {textColor}">{comparison}</span>
  </span>
  <span class="text-lg font-medium text-blue-700 dark:text-white">Mean dBA level: <span class="italic {textColor}">{noise}</span> dBA</span>
</div>
<div class="w-full bg-gray-200 rounded-full h-2.5 md:h-3.5 dark:bg-gray-700">
  <div class="{bgColor} h-2.5 md:h-3.5 rounded-full transition-all duration-700" style="width: {level}%"></div>
</div>