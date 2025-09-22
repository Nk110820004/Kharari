import React from 'react';
import { Gem } from 'lucide-react';
import { useRazorpay } from '../../hooks/useRazorpay';
import { User } from '../../App';

interface DiamondStoreProps {
    onBuyDiamonds: (amount: number) => void;
    user: User;
}

const diamondPacks = [
    { name: 'Starter Pack', diamonds: 50, bonus: 0, price: 29, priceInPaise: 2900 },
    { name: 'Student Pack', diamonds: 100, bonus: 20, price: 69, priceInPaise: 6900, popular: true },
    { name: 'Pro Pack', diamonds: 200, bonus: 100, price: 149, priceInPaise: 14900 },
    { name: 'Career Pack', diamonds: 500, bonus: 300, price: 349, priceInPaise: 34900 },
];

const DiamondStore: React.FC<DiamondStoreProps> = ({ onBuyDiamonds, user }) => {
    const { displayRazorpay } = useRazorpay(user);

    const handleBuyClick = (pack: typeof diamondPacks[0]) => {
        const totalDiamonds = pack.diamonds + pack.bonus;
        displayRazorpay({
            amount: pack.priceInPaise,
            name: `${pack.name} - ${totalDiamonds} Diamonds`,
            onSuccess: () => {
                onBuyDiamonds(totalDiamonds);
            }
        });
    };

    return (
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3"><Gem size={20} className="text-cyan-400"/> Get Diamonds</h3>
            <p className="text-neutral-400 text-sm mb-6">Purchase diamonds to unlock special features like playing more mini-games.</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {diamondPacks.map((pack, index) => (
                    <div key={index} className="relative bg-neutral-800 border border-neutral-700 p-4 rounded-lg text-center flex flex-col justify-between">
                        {pack.popular && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs bg-blue-600 text-white px-3 py-1 rounded-full font-bold">POPULAR</div>
                        )}
                        <div>
                            <p className="font-semibold text-white">{pack.name}</p>
                            <div className="flex items-center justify-center gap-2 text-2xl font-bold text-cyan-400 my-3">
                                <Gem size={20}/> {pack.diamonds}
                            </div>
                            {pack.bonus > 0 && <p className="text-xs text-green-400 font-semibold mb-3">+{pack.bonus} Bonus!</p>}
                        </div>
                        <button 
                            onClick={() => handleBuyClick(pack)}
                            className="mt-3 w-full px-4 py-2 bg-blue-600 rounded-lg font-bold hover:bg-blue-700 transition-colors"
                        >
                            ₹{pack.price}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DiamondStore;