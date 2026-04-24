'use client';

import { useState, useEffect, useRef } from 'react';

interface Session {
  token: string;
  wallet: string;
  username: string;
  email: string;
}

interface Collection {
  name: string;
  address: string;
  contractAddress?: string;
}

interface MintPortalProps {
  session: Session;
  onLogout: () => void;
}

type MintStep = { label: string; status: 'pending' | 'active' | 'done' | 'error'; error?: string };

export default function MintPortal({ session, onLogout }: MintPortalProps) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [showCollectionMenu, setShowCollectionMenu] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [recipientsText, setRecipientsText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [minting, setMinting] = useState(false);
  const [mintSteps, setMintSteps] = useState<MintStep[]>([]);
  const [mintDone, setMintDone] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const params = session.wallet
      ? `wallet=${encodeURIComponent(session.wallet)}`
      : `username=${encodeURIComponent(session.username)}`;
    fetch(`/api/community/collections?${params}`)
      .then((r) => r.json())
      .then((data) => {
        const cols = (data.collections || []).map((c: Record<string, string>) => ({
          name: c.name,
          address: c.contractAddress || c.address,
        }));
        setCollections(cols);
        if (cols.length > 0) setSelectedCollection(cols[0]);
      });
  }, [session.wallet, session.username]);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
  }

  function canMint() {
    return file && name && description && selectedCollection && !minting;
  }

  async function handleMint() {
    if (!canMint()) return;
    setMinting(true);
    setMintDone(false);

    const recipients = recipientsText
      .split(/[\s,]+/)
      .map((s) => s.trim())
      .filter((s) => /^0x[a-fA-F0-9]{40}$/.test(s));
    const willAirdrop = recipients.length > 0;

    const steps: MintStep[] = [
      { label: 'UPLOAD MEDIA', status: 'pending' },
      { label: 'UPLOAD METADATA', status: 'pending' },
      { label: 'CREATE MOMENT', status: 'pending' },
      { label: 'CONFIRMING', status: 'pending' },
      ...(willAirdrop ? [{ label: `AIRDROP (${recipients.length})`, status: 'pending' as const }] : []),
    ];
    setMintSteps([...steps]);

    try {
      // Step 1: Upload media
      steps[0].status = 'active';
      setMintSteps([...steps]);

      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          const comma = result.indexOf(',');
          resolve(comma >= 0 ? result.slice(comma + 1) : result);
        };
        reader.onerror = () => reject(reader.error || new Error('FileReader failed'));
        reader.readAsDataURL(file!);
      });

      const uploadRes = await fetch('/api/community/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: base64,
          contentType: file!.type,
          filename: file!.name,
          apiKey: session.token,
        }),
      });
      if (!uploadRes.ok) throw new Error('Upload failed');
      const { uri: mediaUri } = await uploadRes.json();
      steps[0].status = 'done';
      setMintSteps([...steps]);

      // Step 2: Upload metadata
      steps[1].status = 'active';
      setMintSteps([...steps]);

      const isVideo = file!.type.startsWith('video/');
      const metadata: Record<string, unknown> = {
        name,
        description,
        image: isVideo ? mediaUri : mediaUri,
        content: { mime: file!.type, uri: mediaUri },
      };
      if (isVideo) {
        metadata.animation_url = mediaUri;
      }

      const metaJson = JSON.stringify(metadata);
      const metaBase64 = btoa(unescape(encodeURIComponent(metaJson)));

      const metaRes = await fetch('/api/community/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: metaBase64,
          contentType: 'application/json',
          filename: 'metadata.json',
          apiKey: session.token,
        }),
      });
      if (!metaRes.ok) throw new Error('Metadata upload failed');
      const { uri: momentUri } = await metaRes.json();
      steps[1].status = 'done';
      setMintSteps([...steps]);

      // Step 3: Mint
      steps[2].status = 'active';
      setMintSteps([...steps]);

      const mintRes = await fetch('/api/community/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          momentUri,
          collectionAddress: selectedCollection!.address,
          account: session.wallet,
          recipientCount: recipients.length || 1,
          priceEth: price.trim() || '0',
          apiKey: session.token,
        }),
      });
      if (!mintRes.ok) throw new Error('Mint failed');
      const mintData = await mintRes.json();
      const tokenId = mintData?.tokenId;
      const mintedCollection = mintData?.contractAddress || selectedCollection!.address;
      steps[2].status = 'done';
      setMintSteps([...steps]);

      // Step 4: Confirm
      steps[3].status = 'active';
      setMintSteps([...steps]);
      await new Promise((r) => setTimeout(r, 3000));
      steps[3].status = 'done';
      setMintSteps([...steps]);

      // Step 5: Airdrop (optional)
      if (willAirdrop) {
        steps[4].status = 'active';
        setMintSteps([...steps]);
        const airdropRes = await fetch('/api/community/airdrop', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            collectionAddress: mintedCollection,
            tokenId,
            recipients,
            account: session.wallet,
            apiKey: session.token,
          }),
        });
        if (!airdropRes.ok) {
          const errBody = await airdropRes.json().catch(() => ({}));
          throw new Error('Airdrop failed: ' + (errBody.error || airdropRes.status));
        }
        steps[4].status = 'done';
        setMintSteps([...steps]);
      }

      setMintDone(true);
    } catch (err) {
      const active = steps.find((s) => s.status === 'active');
      if (active) {
        active.status = 'error';
        active.error = err instanceof Error ? err.message : 'Unknown error';
      }
      setMintSteps([...steps]);
    }

    setMinting(false);
  }

  function handleReset() {
    setFile(null);
    setPreview('');
    setName('');
    setDescription('');
    setPrice('');
    setRecipientsText('');
    setMintSteps([]);
    setMintDone(false);
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.15)',
    color: '#fff',
    padding: '12px 14px',
    fontSize: '12px',
    fontFamily: 'inherit',
    fontWeight: 'bold',
    textTransform: 'uppercase' as const,
    outline: 'none',
    letterSpacing: '0.05em',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '10px',
    fontWeight: 'bold',
    textTransform: 'uppercase' as const,
    color: '#fff',
    letterSpacing: '0.1em',
    marginBottom: '6px',
    display: 'block',
  };

  if (mintSteps.length > 0) {
    return (
      <div style={{ padding: '40px 20px', maxWidth: 'min(500px, 90vw)', margin: '0 auto' }}>
        <h3 style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#666', marginBottom: '24px', textAlign: 'center' }}>
          {mintDone ? 'MOMENT CREATED' : 'MINTING...'}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {mintSteps.map((s, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              border: `1px solid ${s.status === 'error' ? 'rgba(255,4,32,0.3)' : s.status === 'done' ? 'rgba(0,160,128,0.3)' : 'rgba(255,255,255,0.08)'}`,
            }}>
              <span style={{
                fontSize: '11px',
                fontWeight: 'bold',
                color: s.status === 'done' ? '#ff4b00' : s.status === 'error' ? '#FF0420' : s.status === 'active' ? '#fff' : '#444',
              }}>
                {s.status === 'done' ? '\u2713' : s.status === 'error' ? '\u2717' : s.status === 'active' ? '\u25CB' : '\u2014'}
              </span>
              <span style={{
                fontSize: '11px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: s.status === 'done' ? '#ff4b00' : s.status === 'error' ? '#FF0420' : s.status === 'active' ? '#fff' : '#444',
              }}>
                {s.label}
              </span>
              {s.error && <span style={{ fontSize: '9px', color: '#FF0420', marginLeft: 'auto' }}>{s.error}</span>}
            </div>
          ))}
        </div>
        {(mintDone || mintSteps.some((s) => s.status === 'error')) && (
          <button onClick={handleReset} style={{
            display: 'block',
            width: '100%',
            marginTop: '24px',
            background: '#fff',
            color: '#000',
            border: 'none',
            padding: '14px',
            fontSize: '12px',
            fontWeight: 'bold',
            fontFamily: 'inherit',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
          }}>
            {mintDone ? 'CREATE ANOTHER' : 'TRY AGAIN'}
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 20px', maxWidth: 'min(500px, 90vw)', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <span style={{ fontSize: '10px', color: '#fff', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {session.username}
          </span>
        </div>
        <button onClick={onLogout} style={{
          background: 'none',
          border: '1px solid rgba(255,255,255,0.15)',
          color: '#fff',
          padding: '4px 10px',
          fontSize: '9px',
          fontWeight: 'bold',
          fontFamily: 'inherit',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          LOGOUT
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <span style={labelStyle}>MEDIA</span>
        <input
          ref={fileRef}
          type="file"
          accept="image/*,video/mp4"
          onChange={handleFile}
          style={{ display: 'none' }}
        />
        {preview ? (
          <div style={{ position: 'relative' }}>
            {file?.type.startsWith('video/') ? (
              <video src={preview} style={{ width: '100%', maxHeight: '300px', objectFit: 'contain', background: '#111' }} controls />
            ) : (
              <img src={preview} style={{ width: '100%', maxHeight: '300px', objectFit: 'contain', background: '#111' }} alt="" />
            )}
            <button onClick={() => { setFile(null); setPreview(''); }} style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              background: 'rgba(0,0,0,0.8)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff',
              padding: '4px 8px',
              fontSize: '9px',
              fontWeight: 'bold',
              fontFamily: 'inherit',
              textTransform: 'uppercase',
            }}>
              REMOVE
            </button>
          </div>
        ) : (
          <button onClick={() => fileRef.current?.click()} style={{
            width: '100%',
            padding: '24px',
            border: '1px dashed rgba(255,255,255,0.15)',
            background: 'transparent',
            color: '#fff',
            fontSize: '11px',
            fontWeight: 'bold',
            fontFamily: 'inherit',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}>
            UPLOAD IMAGE OR VIDEO
          </button>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <span style={labelStyle}>NAME</span>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="MOMENT NAME" style={{ ...inputStyle, textTransform: 'none' as const }} />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <span style={labelStyle}>DESCRIPTION</span>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="DESCRIBE THIS MOMENT" rows={3} style={{ ...inputStyle, resize: 'vertical' as const, minHeight: '80px', textTransform: 'none' as const }} />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <span style={labelStyle}>PRICE (ETH)</span>
        <input
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="0"
          inputMode="decimal"
          style={{ ...inputStyle, textTransform: 'none' as const }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <span style={labelStyle}>AIRDROP RECIPIENTS</span>
        <textarea
          value={recipientsText}
          onChange={(e) => setRecipientsText(e.target.value)}
          placeholder="0x... addresses, comma or newline separated (optional)"
          rows={3}
          style={{ ...inputStyle, resize: 'vertical' as const, minHeight: '70px', textTransform: 'none' as const, fontSize: '11px' }}
        />
      </div>

      <div style={{ marginBottom: '24px', position: 'relative' }}>
        <span style={labelStyle}>COLLECTION</span>
        <button onClick={() => setShowCollectionMenu(!showCollectionMenu)} style={{
          ...inputStyle,
          textAlign: 'left',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span>{selectedCollection?.name || 'SELECT COLLECTION'}</span>
          <span style={{ color: '#444' }}>{showCollectionMenu ? '\u25B2' : '\u25BC'}</span>
        </button>
        {showCollectionMenu && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: '#111',
            border: '1px solid rgba(255,255,255,0.15)',
            zIndex: 10,
            maxHeight: '200px',
            overflowY: 'auto',
          }}>
            {collections.map((c) => (
              <button key={c.address} onClick={() => { setSelectedCollection(c); setShowCollectionMenu(false); }} style={{
                display: 'block',
                width: '100%',
                padding: '10px 14px',
                background: selectedCollection?.address === c.address ? 'rgba(255,255,255,0.1)' : 'transparent',
                border: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                color: '#fff',
                fontSize: '11px',
                fontWeight: 'bold',
                fontFamily: 'inherit',
                textTransform: 'uppercase',
                textAlign: 'left',
                letterSpacing: '0.05em',
              }}>
                {c.name}
              </button>
            ))}
            {collections.length === 0 && (
              <div style={{ padding: '10px 14px', color: '#444', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                NO COLLECTIONS FOUND
              </div>
            )}
          </div>
        )}
      </div>

      <button onClick={handleMint} disabled={!canMint()} style={{
        width: '100%',
        background: canMint() ? '#fff' : 'rgba(255,255,255,0.1)',
        color: canMint() ? '#000' : '#333',
        border: 'none',
        padding: '14px',
        fontSize: '12px',
        fontWeight: 'bold',
        fontFamily: 'inherit',
        textTransform: 'uppercase',
        letterSpacing: '0.15em',
      }}>
        MINT
      </button>
    </div>
  );
}
