import React from 'react';
import GitHubButton from 'react-github-btn';

const InfoSection: React.FC = () => (
  <>
    <p className='info'>
      * Prices are collected from{' '}
      <a
        target='_blank'
        rel='noreferrer noopener'
        href='https://www.bajus.org/gold-price'
      >
        Bangladesh Jewellers Association website
      </a>
      <br />
      * There is a 5% VAT on all gold purchases in Bangladesh <br />* If purchased in
      jewelry form, there is additional making charges
    </p>
    <p>
      <GitHubButton
        href='https://github.com/sjsakib/gold-price'
        data-icon='octicon-star'
        aria-label='Star sjsakib/gold-price on GitHub'
        data-show-count={true}
      >
        Star
      </GitHubButton>
    </p>
  </>
);

export default InfoSection; 