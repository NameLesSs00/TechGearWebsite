const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

const TOKEN = process.env.ADMIN_TOKEN || '';
const BASE_URL = 'https://tech-gear-backend-site.premiumasp.net/api';

async function main() {
  try {
    const rawData = fs.readFileSync(path.join(__dirname, 'techgear_acc_product.json'), 'utf-8');
    const products = JSON.parse(rawData);
    const item = products[0];

    // Payload for POST /api/products
    const createPayload = {
      productLink: item.productLink || null,
      translations: item.translations || [],
      featuresSummary: item.featuresSummary || [],
      featureBlocks: (item.featureBlocks || []).map(fb => ({
        displayOrder: fb.displayOrder,
        translations: fb.translations
      })),
      faqs: item.faqs || [],
      reviews: item.reviews || []
    };

    console.log('1. Creating product...');
    const createRes = await axios.post(`${BASE_URL}/products`, createPayload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TOKEN}`
      }
    });

    console.log('Create response:', createRes.data);
    const productId = createRes.data?.data;
    if (!productId) {
      throw new Error('No product ID returned: ' + JSON.stringify(createRes.data));
    }
    console.log('Product created with ID:', productId);

    // 2. Upload images
    const heroPath = path.resolve(__dirname, '1000317532.png');
    const iconPath = path.resolve(__dirname, '../public/logo.svg');

    console.log('2. Uploading images...');
    console.log('Hero image:', heroPath);
    console.log('Icon image:', iconPath);

    const form = new FormData();
    if (fs.existsSync(heroPath)) {
      form.append('HeroImage', fs.createReadStream(heroPath));
    } else {
      console.warn('Hero image not found at', heroPath);
    }

    if (fs.existsSync(iconPath)) {
      form.append('IconImage', fs.createReadStream(iconPath));
    } else {
      console.warn('Icon image not found at', iconPath);
    }

    const imageRes = await axios.put(`${BASE_URL}/products/${productId}/images`, form, {
      headers: {
        ...form.getHeaders(),
        'Authorization': `Bearer ${TOKEN}`
      }
    });
    console.log('Images upload response:', imageRes.data);

    // 3. Verification
    console.log('3. Verifying created product...');
    const verifyEn = await axios.get(`${BASE_URL}/products/${productId}?language=en`);
    console.log('Verified EN product:', {
      id: verifyEn.data?.data?.id,
      title: verifyEn.data?.data?.title,
      hero_image: verifyEn.data?.data?.hero_image,
      icon_image: verifyEn.data?.data?.icon_image,
      featuresCount: verifyEn.data?.data?.features_summary?.length,
      blocksCount: verifyEn.data?.data?.feature_blocks?.length,
      faqsCount: verifyEn.data?.data?.faqs?.length
    });

    const verifyAr = await axios.get(`${BASE_URL}/products/${productId}?language=ar`);
    console.log('Verified AR product:', {
      id: verifyAr.data?.data?.id,
      title: verifyAr.data?.data?.title,
      hero_image: verifyAr.data?.data?.hero_image,
      icon_image: verifyAr.data?.data?.icon_image
    });

    console.log('\n=== SUCCESS! Product added successfully ===');
  } catch (error) {
    console.error('Error adding product:', error.response?.data || error.message);
    process.exit(1);
  }
}

main();
