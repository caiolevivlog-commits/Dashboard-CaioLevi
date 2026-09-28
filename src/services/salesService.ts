import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  writeBatch,
  Unsubscribe
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { SaleRecord } from '../types/dashboard';
import { INITIAL_SALES_DATA } from '../data/initialSalesData';

const SALES_COLLECTION = 'sales';

export function subscribeToSales(
  onData: (records: SaleRecord[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const colRef = collection(db, SALES_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const records: SaleRecord[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        records.push({
          id: docSnap.id,
          data: data.data || '',
          vendedor: data.vendedor || '',
          produto: data.produto || '',
          quantidade: Number(data.quantidade) || 0,
          preco: Number(data.preco) || 0,
          faturamento: Number(data.faturamento) || (Number(data.quantidade) || 0) * (Number(data.preco) || 0),
          formaPagamento: data.formaPagamento || 'Pix',
          regiao: data.regiao || 'Geral',
        });
      });
      onData(records);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.GET, SALES_COLLECTION);
      } catch (err) {
        if (onError && err instanceof Error) {
          onError(err);
        }
      }
    }
  );
}

export async function addSaleToFirestore(record: SaleRecord): Promise<void> {
  const path = `${SALES_COLLECTION}/${record.id}`;
  try {
    const docRef = doc(db, SALES_COLLECTION, record.id);
    await setDoc(docRef, {
      data: record.data,
      vendedor: record.vendedor,
      produto: record.produto,
      quantidade: record.quantidade,
      preco: record.preco,
      faturamento: record.faturamento,
      formaPagamento: record.formaPagamento,
      regiao: record.regiao || 'Geral',
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteSaleFromFirestore(id: string): Promise<void> {
  const path = `${SALES_COLLECTION}/${id}`;
  try {
    const docRef = doc(db, SALES_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function batchSaveSalesToFirestore(
  records: SaleRecord[],
  mode: 'replace' | 'append' = 'append'
): Promise<void> {
  try {
    if (mode === 'replace') {
      // Clear existing records
      const existingSnap = await getDocs(collection(db, SALES_COLLECTION));
      const deleteBatch = writeBatch(db);
      existingSnap.docs.forEach((d) => {
        deleteBatch.delete(d.ref);
      });
      await deleteBatch.commit();
    }

    // Write in chunks of up to 450 (Firestore batch limit is 500)
    const chunkSize = 400;
    for (let i = 0; i < records.length; i += chunkSize) {
      const chunk = records.slice(i, i + chunkSize);
      const batch = writeBatch(db);
      chunk.forEach((rec) => {
        const docRef = doc(db, SALES_COLLECTION, rec.id);
        batch.set(docRef, {
          data: rec.data,
          vendedor: rec.vendedor,
          produto: rec.produto,
          quantidade: rec.quantidade,
          preco: rec.preco,
          faturamento: rec.faturamento,
          formaPagamento: rec.formaPagamento,
          regiao: rec.regiao || 'Geral',
        });
      });
      await batch.commit();
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, SALES_COLLECTION);
  }
}

export async function seedInitialSalesIfEmpty(): Promise<boolean> {
  try {
    const snap = await getDocs(collection(db, SALES_COLLECTION));
    if (snap.empty) {
      await batchSaveSalesToFirestore(INITIAL_SALES_DATA, 'replace');
      return true;
    }
    return false;
  } catch (error) {
    console.warn('Could not auto-seed Firestore (might be offline or initial setup):', error);
    return false;
  }
}
