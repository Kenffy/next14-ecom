import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "./ui/input";
import { FilterPrices } from "@/data/data";
import { shopStore, useShopState } from "@/features/client/shop-page/shop-store";

export default function CustomPriceFilterForm() {
  const { filterPrice } = useShopState();

  const handleChange = (price: string) => {
    const values = price.split(",");
    const min = parseFloat(values[0]);
    const max = parseFloat(values[1]);
    shopStore.updateFilterPrice({
      minPrice: min,
      maxPrice: max
    });
  };

  const handleMinPrice = (price: number) => {
    shopStore.updateFilterPrice({
      ...filterPrice,
      minPrice: price,
    });
  }

  const handleMaxPrice = (price: number) => {
    shopStore.updateFilterPrice({
      ...filterPrice,
      maxPrice: price,
    });
  }


  return (
    <div className="flex flex-col gap-6">
      <RadioGroup
        onValueChange={(value) => handleChange(value)}
        className=" gap-4 z-0"
      >
        {FilterPrices.map((price, index) => {
          return (
            <div className="flex items-center space-x-2" key={index}>
              <RadioGroupItem value={price.value} id={`radio${index}`} />
              <Label htmlFor={`radio${index}`}>{price.type}</Label>
            </div>
          );
        })}
      </RadioGroup>

      <div className=" flex items-center gap-4">
        <Input
          onChange={(e) => handleMinPrice(parseFloat(e.target.value))}
          type="number"
          value={filterPrice.minPrice == 0 ? "" : filterPrice.minPrice}
          placeholder="€ Min."
        />

        <Input
          onChange={(e) => handleMaxPrice(parseFloat(e.target.value))}
          type="number"
          value={filterPrice.maxPrice == 0 || filterPrice.maxPrice == 9999 ? "" : filterPrice.maxPrice}
          placeholder="€ Max."
        />
      </div>
    </div>
  );
}
