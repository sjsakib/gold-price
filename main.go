package main

import (
	"fmt"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/gocolly/colly"
)

type Price struct {
	Date        string `json:"date"`
	K22         int    `json:"k22"`
	K21         int    `json:"k21"`
	K18         int    `json:"k18"`
	Traditional int    `json:"traditional"`
}

func main() {
	c := colly.NewCollector()

	todayPrice := Price{}
	todayPrice.Date = time.Now().Format("2006-01-02")

	getPrice := func(e *colly.HTMLElement) int {
		priceStr := strings.NewReplacer(",", "", " BDT/GRAM", "").Replace(e.Text)
		price, err := strconv.Atoi(priceStr)
		if err != nil {
			fmt.Println(err)
		}
		return price
	}
	c.OnHTML(".gold-table tr:nth-child(1) .price", func(e *colly.HTMLElement) {
		todayPrice.K22 = getPrice(e)
	})
	c.OnHTML(".gold-table tr:nth-child(2) .price", func(e *colly.HTMLElement) {
		todayPrice.K21 = getPrice(e)
	})
	c.OnHTML(".gold-table tr:nth-child(3) .price", func(e *colly.HTMLElement) {
		todayPrice.K18 = getPrice(e)
	})
	c.OnHTML(".gold-table tr:nth-child(4) .price", func(e *colly.HTMLElement) {
		todayPrice.Traditional = getPrice(e)
	})

	c.OnScraped(func(r *colly.Response) {
		fmt.Println(todayPrice)

		f, err := os.OpenFile("./fe/src/prices.csv", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
		if err != nil {
			panic(err)
		}
		defer f.Close()
		fmt.Fprintf(f, "%s,%d,%d,%d,%d\n", todayPrice.Date, todayPrice.K18, todayPrice.K21, todayPrice.K22, todayPrice.Traditional)
	})

	c.Visit("https://www.bajus.org/gold-price")
}
