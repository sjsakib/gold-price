# Gold Price History in Bangladesh

> **This project is no longer maintained.** For current gold prices in Bangladesh, visit the new site: [gold-price.bd](https://gold-price.bd/).
> An [API](https://gold-price.bd/api) for latest gold and silver price is also available.

Gold price history in Bangladesh visualized. The data is collected from [Bangladesh Jewellers Association](https://www.bajus.org/).

A script scheduled via [LaunchAgent](https://developer.apple.com/library/archive/documentation/MacOSX/Conceptual/BPSystemStartup/Chapters/CreatingLaunchdJobs.html) fetches the price using a go executable. It updates the csv file which is then committed and pushed by the script. The push triggers deployment pipeline. The data is thus updated daily.
