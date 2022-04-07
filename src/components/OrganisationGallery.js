export default function RoomGallery(props) {
  const { products } = props;

  const handleSelect = (product) => {
    props.onSelectProduct(product);
  };

  return (
    <div className="bg-white">
      <div className="max-w-2xl mx-auto py-2">
        {/* <h4 className="text-xl font-extrabold tracking-tight text-gray-900">
            Select you
          </h4> */}

        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-2 xl:gap-x-8">
          {products.map((product) => (
            <div
              key={product.name}
              className="group relative pointer-events: auto;"
              onClick={() => handleSelect(product)}
            >
              <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-50 lg:aspect-none">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-center object-cover lg:w-full lg:h-full"
                />
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <a href={product.href}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {product.name}
                    </a>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{product.type}</p>
                </div>
                <p
                  className={`text-sm font-medium ${
                    product.status === "Available"
                      ? "text-green-900"
                      : "text-grey-900"
                  }`}
                >
                  {product.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
