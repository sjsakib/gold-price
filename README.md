# Gold Price History in Bangladesh

Gold price history in Bangladesh visualized. The data is collected from [Bangladesh Jewellers Association](https://www.goldr.org/).

A script scheduled via [LaunchAgent](https://developer.apple.com/library/archive/documentation/MacOSX/Conceptual/BPSystemStartup/Chapters/CreatingLaunchdJobs.html) fetches the price using a go executable. It updates the csv file which is then committed and pushed by the script. The push triggers deployment pipeline. The data is thus updated daily.
