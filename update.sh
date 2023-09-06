cd "$(dirname "$0")"
./gold-price-bd
sort -ru ./fe/src/prices.csv -o ./fe/src/prices.csv
git add .
git commit -m "Updated prices"
git push
