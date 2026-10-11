import { Helmet } from 'react-helmet-async';
import { Row, Col } from 'react-bootstrap';

import Section from '../components/design-system/Section';
import TocSidebar from '../components/design-system/TocSidebar';
import ColorPalette from '../components/design-system/ColorPalette';
import TypographyScale from '../components/design-system/TypographyScale';
import SpacingScale from '../components/design-system/SpacingScale';
import Buttons from '../components/design-system/Buttons';
import Forms from '../components/design-system/Forms';
import Alerts from '../components/design-system/Alerts';
import Badges from '../components/design-system/Badges';
import Cards from '../components/design-system/Cards';
import Tables from '../components/design-system/Tables';
import ProductCardStates from '../components/design-system/ProductCardStates';
import WishlistDemo from '../components/design-system/WishlistDemo';
import CouponDemo from '../components/design-system/CouponDemo';
import PriceDisplay from '../components/design-system/PriceDisplay';
import OrderTimeline from '../components/design-system/OrderTimeline';
import FilterSidebarDemo from '../components/design-system/FilterSidebarDemo';

import '../assets/styles/design-system.css';

const DesignSystemScreen = () => {
  return (
    <>
      <Helmet>
        <title>Design System | ProShop</title>
        <meta
          name='description'
          content='Internal design system & UI kit showcase for ProShop'
        />
      </Helmet>

      {/* HERO */}
      <header
        style={{
          background: 'linear-gradient(135deg,#0d6efd 0%,#6610f2 100%)',
          color: 'white',
          padding: '48px 0',
          marginBottom: 32,
        }}
      >
        <div className='container'>
          <h1 className='mb-2' style={{ fontWeight: 700 }}>
            ProShop Design System
          </h1>
          <p className='lead mb-0 opacity-75'>
            25+ reusable components across 6 categories. Built with
            React-Bootstrap + Custom eCommerce patterns.
          </p>
          <p className='small opacity-50 mt-3 mb-0'>
            Last updated: October 2026 · v1.0
          </p>
        </div>
      </header>

      {/* MAIN GRID */}
      <div className='container-fluid' style={{ paddingBottom: 80 }}>
        <Row>
          {/* ===== Sidebar TOC ===== */}
          <Col xl={2} lg={3} md={4} className='mb-4'>
            <div style={{ paddingLeft: 16, paddingRight: 16 }}>
              <TocSidebar />
            </div>
          </Col>

          {/* ===== Sections ===== */}
          <Col xl={10} lg={9} md={8}>
            <div style={{ maxWidth: 980 }}>
              {/* ===== A. BRAND IDENTITY ===== */}
              <Section
                id='brand'
                title='Brand Identity'
                subtitle='Color tokens, type scale and spacing system used throughout the app.'
                count='A'
              >
                <h5 className='mt-2'>Color palette</h5>
                <p className='text-muted small'>
                  Click any hex to copy. Built on Bootstrap 5 tokens, with
                  <code> success=#198754</code> and <code>danger=#dc3545</code>{' '}
                  reserved for eCommerce-critical states.
                </p>
                <ColorPalette />

                <h5 className='mt-4'>Typography</h5>
                <TypographyScale />

                <h5 className='mt-4'>Spacing scale</h5>
                <SpacingScale />
              </Section>

              {/* ===== B1. BUTTONS ===== */}
              <Section
                id='buttons'
                title='Buttons'
                subtitle='9 variants × 3 sizes · with icons, loading and disabled states'
                count='B'
              >
                <Buttons />
              </Section>

              {/* ===== B2. FORMS ===== */}
              <Section
                id='forms'
                title='Forms'
                subtitle='Inputs, selects, textareas, radios, checks and file upload'
                count='B'
              >
                <Forms />
              </Section>

              {/* ===== B3. ALERTS ===== */}
              <Section
                id='alerts'
                title='Alerts'
                subtitle='Contextual banners for success/error/info/warning feedback'
                count='B'
              >
                <Alerts />
              </Section>

              {/* ===== B4. BADGES ===== */}
              <Section
                id='badges'
                title='Badges'
                subtitle='Pills, counters, headers and icons'
                count='B'
              >
                <Badges />
              </Section>

              {/* ===== B5. CARDS ===== */}
              <Section
                id='cards'
                title='Cards'
                subtitle='Container system for grouped content'
                count='B'
              >
                <Cards />
              </Section>

              {/* ===== B6. TABLES ===== */}
              <Section
                id='tables'
                title='Tables'
                subtitle='Used in admin tables (users, products, coupons, orders)'
                count='B'
              >
                <Tables />
              </Section>

              {/* ===== D1. PRODUCT CARDS ===== */}
              <Section
                id='product'
                title='Product Cards — inventory & rating states'
                subtitle='Same Product component used in catalog grid & search'
                count='D'
              >
                <ProductCardStates />
              </Section>

              {/* ===== D2. WISHLIST ===== */}
              <Section
                id='wishlist'
                title='Wishlist ❤️'
                subtitle='Heart toggle + dedicated page + header badge'
                count='D'
              >
                <WishlistDemo />
              </Section>

              {/* ===== D3. COUPONS ===== */}
              <Section
                id='coupon'
                title='Coupon System 🎟️'
                subtitle='Checkout input box · Order summary · Admin cards'
                count='D'
              >
                <CouponDemo />
              </Section>

              {/* ===== D4. PRICING ===== */}
              <Section
                id='price'
                title='Pricing Display'
                subtitle='Single, sale (with crossed-out), discounted via coupon'
                count='D'
              >
                <PriceDisplay />
              </Section>

              {/* ===== D5. ORDER STATUS ===== */}
              <Section
                id='order'
                title='Order Status Timeline'
                subtitle='4-step state machine: Pending → Paid → Shipped → Delivered'
                count='D'
              >
                <OrderTimeline />
              </Section>

              {/* ===== D6. FILTER SIDEBAR ===== */}
              <Section
                id='filter'
                title='Filter & Sort Sidebar'
                subtitle='Multi-facet: category, brand[], price range, rating, in-stock, sort'
                count='D'
              >
                <FilterSidebarDemo />
              </Section>

              {/* Footer note */}
              <div className='mt-5 p-4 bg-light rounded text-center'>
                <p className='text-muted mb-0'>
                  🛠️ ProShop Design System v1.0 ·{' '}
                  <a
                    href='https://github.com'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    View source on GitHub
                  </a>
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default DesignSystemScreen;
