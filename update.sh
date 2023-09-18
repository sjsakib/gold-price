date
cd "$(dirname "$0")"
./gold-price-bd
git add .
git commit -m "[auto] updated prices"
git push
