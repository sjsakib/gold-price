date
cd "$(dirname "$0")"
./gold-price-bd
cd /Users/sakib/codes/gold-price.bd
git add .
git commit -m "[auto] updated prices"
git push
