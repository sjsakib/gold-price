date
cd "$(dirname "$0")"
./gold-price-bd
sort -ru ./fe/src/prices.csv -o ./fe/src/prices.csv
git add .
git commit -m "[auto] updated prices"
git push
