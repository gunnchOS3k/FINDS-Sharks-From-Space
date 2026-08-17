# Scientific limitations

FINDS is an exploratory research and visualization project. Hotspot scores are not real-time shark warnings and should not be used as a substitute for official marine-safety guidance.

- MUR SST is a blended Level-4 analysis, not a single-sensor snapshot.
- GIBS PNGs are visualizations. Colormap decoding approximates the legend, not the original NetCDF.
- PACE/VIIRS chlorophyll GIBS layers can contain swath gaps; missing pixels are dropped, not interpolated into fake ocean.
- Scores are heuristic (thermal envelope + chlorophyll productivity proxy + local SST gradient). They are not a species distribution model, tagging dataset, or fishery survey.
- Gemini adds language and ranking on supplied cells. It does not observe sharks.
- Latency is hours to a day behind satellite processing, not “now at this beach.”
- No camera, no GPS tracking, no animal telemetry.
