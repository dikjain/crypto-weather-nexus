'use client';

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useStore } from '../store/store';
import Link from 'next/link';

export function DialogDemo() {
  const { favorites, cryptoData, livePrices, removeFavorite } = useStore();

  return (
    <Dialog>
      <DialogTrigger className="bg-blue-500 cursor-pointer text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors" asChild>
        <Button variant="outline">View Favorites</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Favorite Cryptocurrencies</DialogTitle>
          <DialogDescription>
            View and manage your favorite cryptocurrencies
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {favorites.cryptos.length === 0 ? (
            <p className="text-center text-gray-500">No favorite cryptocurrencies added yet</p>
          ) : (
            <div className="space-y-4">
              {favorites.cryptos.map((id) => {
                const coin = cryptoData[id];
                const currentPrice = livePrices[id] || coin?.current_price || 0;
                
                return (
                  <Link
                    href={`/crypto?coin=${id}`}
                    key={id}
                  >
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                      <div className="flex items-center gap-3">
                        {coin?.image && (
                          <img 
                            src={coin.image} 
                            alt={coin.name} 
                            className="w-8 h-8"
                            loading="lazy"
                          />
                        )}
                        <div>
                          <h3 className="font-medium">{coin?.name || id}</h3>
                          <p className="text-sm text-gray-600">
                            ${Number(currentPrice).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })}
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault(); // Prevent link navigation
                          removeFavorite('cryptos', id);
                        }}
                        className="text-red-500 cursor-pointer hover:text-red-700 hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
