import { Button } from '@/components/ui/button';
import useCartService from '@/hooks/useCartStore';
import { OrderItem } from '@/schemas/models';
import { useRouter } from 'next/navigation';
import React, { FC, useEffect, useState } from 'react';

interface AddCartProps {
  product: OrderItem;
}

export const AddToCart: FC<AddCartProps> = ({product}) => {
    const { items, increase, decrease } = useCartService();
    const [existItem, setExistItem] = useState<OrderItem | undefined>();
    const [quantity, setQuantity] = useState<number>(1);

    const router = useRouter();

    useEffect(() => {
        const orderItem = product.variable ? 
          items.find((x)=> x.slug === product.slug && (
            x.variable && product.variable 
            && x.variantId === product.variantId && x.attributes && product.attributes
            && x.attributes.map(a => a.value).join(",") === product.attributes.map(a => a.value).join(",")
            )) : 
          items.find((x) => x.slug === product.slug);
        if (orderItem) {
          setExistItem(orderItem);
          setQuantity(orderItem.qty);
        }
      }, [product, items]);
    
      const handleIncreaseItem = () => {
        if (existItem) {
          increase(existItem);
        } else {
          increase(product);
        }
        router.refresh();
      };
    
      const handleDecreaseItem = () => {
        if (!existItem) return;
        decrease(existItem);
        router.refresh();
      };

    if (existItem)
    return (
      <div className=" w-fit flex items-center text-xl border-[2px] border-white/20 rounded-md overflow-hidden">
        <Button onClick={handleDecreaseItem} className=" text-xl">
          -
        </Button>
        <div className=" flex items-center justify-center h-[45px] w-[45px]">
          <span className=" text-center">{quantity}</span>
        </div>
        <Button onClick={handleIncreaseItem} className=" text-xl">
          +
        </Button>
      </div>
    );
  return (
    <Button onClick={handleIncreaseItem} className="w-full  md:w-[180px]">
      <span>Add to Cart</span>
    </Button>
  )
}
