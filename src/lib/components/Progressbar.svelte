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
        { min: 80, max: 90, desc: "Classroom" },
        { min: 90, max: 100, desc: "Train" },
        { min: 100, max: 110, desc: "Boiler Room" },
        { min: 110, max: 120, desc: "Construction Site" },
        { min: 120, max: 130, desc: "Night Club" },
        { min: 130, max: 140, desc: "Operating Heavy Equipment" },
        { min: 140, max: 150, desc: "Jet Taking Off" },
        { min: 150, max: Infinity, desc: "Threshold of Pain" }
    ];

    function getNoiseComparison(noise: number) {
        const found = noiseRanges.find(r => noise >= r.min && noise < r.max)
        return found ? found.desc : "Unknown"
    };

    let comparison = $derived(getNoiseComparison(noise))
</script>

<div class="flex justify-between mb-1">
  <span class="text-lg font-medium text-white">Point is <span class="italic {textColor} font-semibold">{desc}</span> (similar to the noise of
    {#if 'aeiouAEIOU'.includes((comparison ?? '')[0] || '')}
        an
    {:else}
        a
    {/if}
     <span class="italic {textColor} font-semibold">{comparison}</span>)
  </span>
  <span class="text-lg font-medium text-white">Mean dBA level: <span class="italic {textColor} font-semibold">{noise}</span></span>
</div>
<div class="w-full rounded-full h-4 md:h-5 bg-gray-700">
  <div class="{bgColor} h-4 md:h-5 rounded-full text-sm font-medium text-white flex items-center justify-center leading-none" style="width: {level}%">{noise} dBA</div>
</div>