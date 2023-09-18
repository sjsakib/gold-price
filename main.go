package main

import (
	"encoding/csv"
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

func writeRow(row *[]string, priceData *Price) {
	(*row)[0] = priceData.Date
	(*row)[1] = strconv.Itoa(priceData.K18)
	(*row)[2] = strconv.Itoa(priceData.K21)
	(*row)[3] = strconv.Itoa(priceData.K22)
	(*row)[4] = strconv.Itoa(priceData.Traditional)
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

		f, err := os.OpenFile("./fe/src/prices.csv", os.O_RDWR, 0644)
		if err != nil {
			panic(err)
		}
		defer f.Close()
		csvReader := csv.NewReader(f)

		records, err := csvReader.ReadAll()
		if err != nil {
			panic(err)
		}
		exists := false
		for i := 0; i < len(records); i++ {
			if records[i][0] == todayPrice.Date {
				writeRow(&records[i], &todayPrice)
				exists = true
				break
			}
		}
		if !exists {
			records = append(records, make([]string, 5))
			writeRow(&records[len(records)-1], &todayPrice)
		}
		f.Seek(0, 0);
		csv.NewWriter(f).WriteAll(records)
	})

	c.Visit("https://www.bajus.org/gold-price")
}
