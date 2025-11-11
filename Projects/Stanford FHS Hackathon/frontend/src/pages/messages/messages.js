import { useState } from 'react';

export default function Messages() {
  const sellers = [
    {
      id: 1,
      name: "John's Realty",
      messages: [
        { sender: 'seller', text: 'Hello! Let me know if you have any questions.' },
        { sender: 'buyer', text: 'Thank you! Could you provide more info about the property on Main St?' },
        { sender: 'seller', text: 'Sure, it has 3 bedrooms, 2 baths, and was recently renovated.' },
      ],
    },
    {
      id: 2,
      name: "Sunset Properties",
      messages: [
        { sender: 'seller', text: 'Hello, I saw you were interested in our condo listing.' },
        { sender: 'buyer', text: 'Hi! Yes, I am. Could you tell me about the HOA fees?' },
      ],
    },
    {
      id: 3,
      name: "Green Valley Homes",
      messages: [
        { sender: 'buyer', text: 'Can we schedule a walkthrough this weekend?' },
        { sender: 'seller', text: 'Absolutely, Saturday 10 AM works. Does that fit your schedule?' },
      ],
    },
  ];

  const [activeSellerId, setActiveSellerId] = useState(sellers[0].id);

  const activeSeller = sellers.find((seller) => seller.id === activeSellerId);

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-900">
      <aside className="w-64 border-r border-gray-200 dark:border-gray-700 bg-gray-800 p-4">
        <h2 className="text-xl font-bold text-white mb-4">Messages</h2>
        <ul className="space-y-2">
          {sellers.map((seller) => (
            <li key={seller.id}>
              <button
                onClick={() => setActiveSellerId(seller.id)}
                className={`w-full text-left p-2 rounded-md hover:bg-gray-700 
                  ${activeSellerId === seller.id ? 'bg-gray-700 font-semibold' : ''}`}
              >
                <span className="text-white">{seller.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <div className="flex-1 flex flex-col">
        <div className="border-b border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{activeSeller.name}</h3>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800">
          {activeSeller.messages.map((msg, idx) => {
            const isSeller = msg.sender === 'seller';
            return (
              <div
                key={idx}
                className={`max-w-xs p-2 rounded-md ${
                  isSeller
                    ? 'bg-green-500 text-white mr-auto'
                    : 'bg-blue-600 text-white ml-auto'
                }`}
                style={{ width: 'fit-content' }}
              >
                {msg.text}
              </div>
            );
          })}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex space-x-2 bg-white dark:bg-gray-900">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Send</button>
        </div>
      </div>
    </div>
  );
}